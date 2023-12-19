# marking_system/views.py

from django.shortcuts import render, redirect
from django.db import connection
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def welcome_page(request):
    return render(request, 'marking_system/welcome_page.html')

def student_login(request):
    if request.method == 'POST':
        email_or_admission_number = request.POST.get('email')
        password = request.POST.get('password')

        # Query the database for the given email or admission number and password
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM student WHERE (email = %s OR admission_number = %s) AND password = %s", [email_or_admission_number, email_or_admission_number, password])
            user_data = cursor.fetchone()

        if user_data:
            # If a user with the given email or admission number and password is found
            # You may want to store some user-related information in the session
            request.session['student_id'] = user_data[0]
            request.session['student_name'] = user_data[2]

            # Redirect to a success page or any desired page
            return redirect('student_dashboard')
        else:
            # Authentication failed, show an error message
            error_message = "Invalid email, admission number, or password. Please try again."
            messages.error(request, error_message)

    # If the request method is GET, just render the login page
    return render(request, 'marking_system/student_login.html')

def teacher_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Query the database for the given email and password
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM teacher WHERE email = %s AND password = %s", [email, password])
            user_data = cursor.fetchone()

        if user_data:
            # If a user with the given email and password is found
            # You may want to store some user-related information in the session
            request.session['teacher_id'] = user_data[0]
            request.session['teacher_name'] = user_data[1]

            # Redirect to a success page or any desired page
            return redirect('teacher_dashboard')
        else:
            # Authentication failed, show an error message
            error_message = "Invalid email or password. Please try again."
            messages.error(request, error_message)

    # If the request method is GET, just render the login page
    return render(request, 'marking_system/teacher_login.html')


def teacher_dashboard(request):
    # Check if the 'teacher_id' key exists in the session
    if 'teacher_id' not in request.session:
        # If the session doesn't exist, redirect to the login page
        return redirect('teacher_login')
    
    # Retrieve teacher name from the session
    teacher_name = request.session.get('teacher_name', 'Unknown Teacher')

    # Pass the teacher_name to the template
    return render(request, 'marking_system/teacher_dashboard.html', {'teacher_name': teacher_name})

def logout_view(request):
    # Unset all sessions
    request.session.clear()

    # Redirect to the welcome page
    return redirect('welcome_page')

# marking_system/views.py

def view_modules(request):
    # Check if the 'teacher_id' key exists in the session
    if 'teacher_id' not in request.session:
        # If the session doesn't exist, redirect to the login page
        return redirect('teacher_login')

    # Retrieve teacher ID from the session
    teacher_id = request.session['teacher_id']

    # Fetch modules associated with the logged-in teacher along with course and level details
    with connection.cursor() as cursor:
        query = """
            SELECT module.module_id, module.module_name, course.course_name, level.level_name
            FROM module
            INNER JOIN course ON module.course_id = course.course_id
            INNER JOIN level ON module.level_id = level.level_id
            WHERE module.teacher_id = %s
        """
        cursor.execute(query, [teacher_id])
        teacher_modules = cursor.fetchall()
        print(teacher_modules)

    # Pass the modules to the template
    return render(request, 'marking_system/view_modules.html', {'teacher_modules': teacher_modules})


def set_exam(request, module_id):
    # Fetch teacher_id from the session
    teacher_id = request.session.get('teacher_id')

    # Fetch module name using module_id and teacher_id from the database
    with connection.cursor() as cursor:
        cursor.execute("SELECT module_name FROM module WHERE module_id = %s AND teacher_id = %s", [module_id, teacher_id])
        module_data = cursor.fetchone()

    if module_data:
        module_name = module_data[0]
    else:
        # Handle the case where the module_id or teacher_id is invalid
        # You can redirect or display an error message as needed
        pass
        # return redirect('some_error_page')

    # Pass the module name to the template
    return render(request, 'marking_system/set_exam.html', {'module_id': module_id,'module_name': module_name,'teacher_id':teacher_id})


def student_dashboard(request):
    # Check if the 'teacher_id' key exists in the session
    if 'student_id' not in request.session:
        # If the session doesn't exist, redirect to the login page
        return redirect('student_login')
    
    # Retrieve teacher name from the session
    student_name = request.session.get('student_name', 'Unknown Student')

    # Pass the teacher_name to the template
    return render(request, 'marking_system/student_dashboard.html', {'student_name': student_name})

def my_modules(request):
    if 'student_id' not in request.session:
        return redirect('student_login')

    student_id = request.session['student_id']

    # Query the database to get the student's course and level
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT s.admission_number, c.course_name, l.level_name
            FROM student s
            JOIN course c ON s.course_id = c.course_id
            JOIN level l ON s.level_id = l.level_id
            WHERE s.student_id = %s
        """, [student_id])
        student_info = cursor.fetchone()

        # Query the database to get the student's modules, course, level, and teacher name
        cursor.execute("""
            SELECT m.module_id, m.module_name, c.course_name, l.level_name, t.teacher_name
            FROM module m
            JOIN course c ON m.course_id = c.course_id
            JOIN level l ON m.level_id = l.level_id
            JOIN teacher t ON m.teacher_id = t.teacher_id
            WHERE m.course_id = (
                SELECT course_id FROM student WHERE student_id = %s
            )
            AND m.level_id = (
                SELECT level_id FROM student WHERE student_id = %s
            )
        """, [student_id, student_id])
        student_modules = cursor.fetchall()

    return render(request, 'marking_system/my_modules.html', {'student_info': student_info, 'student_modules': student_modules})

from django.db import connection
from django.shortcuts import render

def view_exams(request):
    # Step 1: Retrieve Student Information from the Session
    student_id = request.session.get('student_id')

    # Step 2: Retrieve Course and Level for the Student
    with connection.cursor() as cursor:
        cursor.execute("SELECT course_id, level_id FROM student WHERE student_id = %s", [student_id])
        result = cursor.fetchone()

    if not result:
        # Handle the case where student information is not found
        return render(request, 'error_page.html', {'error_message': 'Student information not found'})

    course_id, level_id = result

    # Step 3: Retrieve Modules Associated with Student's Course and Level
    with connection.cursor() as cursor:
        cursor.execute("SELECT module_id, module_name FROM module WHERE course_id = %s AND level_id = %s", [course_id, level_id])
        student_modules = cursor.fetchall()

    # Step 4: Fetch Distinct Module IDs in Questions
    with connection.cursor() as cursor:
        cursor.execute("SELECT DISTINCT module_id FROM questions")
        distinct_module_ids = [row[0] for row in cursor.fetchall()]

    # Step 5: Display Available Exams in a Well-Styled Button
    available_exams = [
        {'module_id': module[0], 'module_name': module[1]} for module in student_modules if module[0] in distinct_module_ids
    ]

    context = {
        'student': {'student_id': student_id},
        'available_exams': available_exams,
    }
    return render(request, 'marking_system/view_exams.html', context)



def start_exam(request,exam_id):
    # Your logic for displaying student's exam results goes here
    return render(request, 'marking_system/start_exam.html',{'exam_id':exam_id})


def exam_results(request):
    # Your logic for displaying student's exam results goes here
    return render(request, 'marking_system/exam_results.html')

@csrf_exempt
def set_multiple_choice_question(request):
    if request.method == 'POST':
        try:
            # Extract question details from the request
            question_details = extract_question_details(request)

            # Validate question details for multiple-choice type
            question_text = question_details.get('question')
            choices = question_details.get('choices')
            marks_str = question_details.get('marks')
            module_id = question_details.get('module_id')

            if not question_text or not choices or not marks_str or marks_str.strip() == '' or module_id is None:
                return JsonResponse({'error': 'Invalid question details'}, status=400)

            # Convert marks to int after ensuring it's not an empty string
            marks = int(marks_str)

            # Ensure there is at least one correct choice
            correct_choices = [choice for choice in choices if choice.get('isCorrect')]
            if len(correct_choices) != 1:
                return JsonResponse({'error': 'There should be exactly one correct choice'}, status=400)

            # Ensure that no choice is empty
            if any(not choice.get('text') for choice in choices):
                return JsonResponse({'error': 'Choices cannot be empty'}, status=400)

            # All validations passed, insert the question into the database
            with connection.cursor() as cursor:
                # Insert into questions table
                cursor.execute(
                    "INSERT INTO questions (question_content, question_type, marks, module_id) VALUES (%s, %s, %s, %s)",
                    (question_text, 'multiple_choice', marks, module_id)
                )

                question_id = cursor.lastrowid  # Get the ID of the inserted question

                # Insert into questionchoices table
                for choice in choices:
                    cursor.execute(
                        "INSERT INTO questionchoices (choice_content, question_id, is_correct) VALUES (%s, %s, %s)",
                        (choice.get('text'), question_id, choice.get('isCorrect'))
                    )

            # Return success response
            return JsonResponse({'status': 'success', 'message': 'Multiple-choice question set successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

@csrf_exempt
def set_true_false_question(request):
    if request.method == 'POST':
        try:
            # Extract question details from the request
            question_details = extract_question_details(request)

            # Validate question details for true/false type
            question_text = question_details.get('question')
            correct_choice = question_details.get('correctChoice')
            marks_str = question_details.get('marks')
            module_id = question_details.get('module_id')

            if not question_text or correct_choice is None or not marks_str or marks_str.strip() == '' or module_id is None:
                return JsonResponse({'error': 'Invalid question details'}, status=400)

            # Convert marks to int after ensuring it's not an empty string
            marks = int(marks_str)

            # All validations passed, insert the question into the database
            with connection.cursor() as cursor:
                # Insert into questions table
                cursor.execute(
                    "INSERT INTO questions (question_content, question_type, marks, module_id) VALUES (%s, %s, %s, %s)",
                    (question_text, 'true_false', marks, module_id)
                )

                question_id = cursor.lastrowid  # Get the ID of the inserted question

                # Insert into answers table
                cursor.execute(
                    "INSERT INTO answers (question_id, answer_content) VALUES (%s, %s)",
                    (question_id, correct_choice)
                )

            # Return success response
            return JsonResponse({'status': 'success', 'message': 'True/false question set successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

@csrf_exempt
def set_open_ended_question(request):
    if request.method == 'POST':
        try:
            # Extract question details from the request
            question_details = extract_question_details(request)

            # Validate question details for open-ended type
            question_text = question_details.get('question')
            answer_text = question_details.get('answer')
            marks = question_details.get('marks')
            module_id = question_details.get('module_id')

            marks_str = question_details.get('marks')

            if not question_text or not answer_text or not marks_str or marks_str.strip() == '' or module_id is None:
                return JsonResponse({'error': 'Invalid question details'}, status=400)

            # Convert marks to int after ensuring it's not an empty string
            marks = int(marks_str)


            # All validations passed, insert the question into the database
            with connection.cursor() as cursor:
                # Insert into questions table
                cursor.execute(
                    "INSERT INTO questions (question_content, question_type, marks, module_id) VALUES (%s, %s, %s, %s)",
                    (question_text, 'open_ended', marks, module_id)
                )

                question_id = cursor.lastrowid  # Get the ID of the inserted question

                # Insert into answers table
                cursor.execute(
                    "INSERT INTO answers (question_id, answer_content) VALUES (%s, %s)",
                    (question_id, answer_text)
                )

            # Return success response
            return JsonResponse({'status': 'success', 'message': 'Open-ended question set successfully'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        
def extract_question_details(request):
    try:
        # Assuming the request body contains JSON data
        data = json.loads(request.body.decode('utf-8'))

        # Extract question details from JSON data
        question_details = {
            'type': data.get('type'),
            'question': data.get('question'),
            'marks': data.get('marks'),
            'teacher_id': data.get('teacher_id'),
            'module_id': data.get('module_id'),
        }

        # Extract additional details based on the question type
        if question_details['type'] == 'multiple_choice':
            # Extract details for multiple choice questions
            choices_array = data.get('choices', [])  # Assuming 'choices' is an array in the data dictionary
            num_choices = len(choices_array)
            print(num_choices)  # Print the length of the 'choices' array
            question_details['choices'] = [
                {'text': choice.get('text', ''), 'isCorrect': choice.get('isCorrect', False)}
                for choice in choices_array if choice.get('text', '').strip() != ''
            ]

        elif question_details['type'] == 'true_false':
            # Extract details for true/false questions
            question_details['correctChoice'] = data.get('correctChoice')

        elif question_details['type'] == 'open_ended':
            # Extract details for open-ended questions
            question_details['answer'] = data.get('answer')

        return question_details
    except json.JSONDecodeError:
        return {'error': 'Invalid JSON data'}
    
def custom_404(request, exception):
    return render(request, 'marking_system/404.html', status=404)
