# marking_system/urls.py

from django.urls import path
from .views import welcome_page, student_login, teacher_login, teacher_dashboard,logout_view, view_modules, set_exam, student_dashboard, my_modules,view_exams, exam_results, set_multiple_choice_question, set_true_false_question, set_open_ended_question, start_exam

urlpatterns = [
    path('', welcome_page, name='welcome_page'),
    path('student/login/', student_login, name='student_login'),
    path('teacher/login/', teacher_login, name='teacher_login'),
    path('teacher_dashboard/', teacher_dashboard, name='teacher_dashboard'),
    path('teacher/view-modules/', view_modules, name='view_modules'),
    path('teacher/set_exam/<int:module_id>/', set_exam, name='set_exam'),
    path('teacher/logout/', logout_view, name='logout'),
    path('teacher/set_exam/api/multiple_choice/', set_multiple_choice_question, name='set_multiple_choice_question'),
    path('teacher/set_exam/api/true_false/', set_true_false_question, name='set_true_false_question'),
    path('teacher/set_exam/api/open_ended/', set_open_ended_question, name='set_open_ended_question'),
    # Add more URL patterns as needed
    # Student URLs
    path('student_dashboard/', student_dashboard, name='student_dashboard'),
    path('my_modules/', my_modules, name='my_modules'),
    path('view_exams/', view_exams, name='view_exams'),
    path('exam_results/', exam_results, name='exam_results'),
    path('start_exam/<int:exam_id>/', start_exam, name='start_exam'),
]

