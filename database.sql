
CREATE TABLE Course (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(255)
);

CREATE TABLE Level (
    level_id INT PRIMARY KEY,
    level_name VARCHAR(255)
);


CREATE TABLE Questions (
    question_id INT PRIMARY KEY,
    question_content TEXT,
    question_type VARCHAR(10), -- open/close
    marks INT,
    course_id INT, -- Foreign Key referencing Courses
    module_id INT, -- Foreign Key referencing Modules
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (module_id) REFERENCES Module(module_id)
);

CREATE TABLE Answers (
    answer_id INT PRIMARY KEY,
    question_id INT, -- Foreign Key referencing Questions
    answer_content TEXT,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);


CREATE TABLE QuestionChoices (
    choice_id INT PRIMARY KEY,
    choice_content TEXT,
    question_id INT, -- Foreign Key referencing Questions
    is_correct BOOLEAN,
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);

CREATE TABLE Teacher (
    teacher_id INT PRIMARY KEY,
    teacher_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255) -- Ideally, store hashed passwords
);

CREATE TABLE Module (
    module_id INT PRIMARY KEY,
    module_name VARCHAR(255),
    course_id INT, -- Foreign Key referencing Courses
    level_id INT, -- Foreign Key referencing Level
    teacher_id INT, -- Foreign Key referencing Teacher
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (level_id) REFERENCES Level(level_id),
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id)
);


CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    admission_number VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    course_id INT, -- Foreign Key referencing Courses
    level_id INT, -- Foreign Key referencing Level
    password VARCHAR(255) -- Ideally, store hashed passwords
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (level_id) REFERENCES Level(level_id)
);


CREATE TABLE GeneralScore (
    score_id INT PRIMARY KEY,
    student_id INT, -- Foreign Key referencing Student
    module_id INT, -- Foreign Key referencing Module
    total_score INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (module_id) REFERENCES Module(module_id)
);



CREATE TABLE QuestionScore (
    qn_score_id INT PRIMARY KEY,
    student_id INT, -- Foreign Key referencing Student
    module_id INT, -- Foreign Key referencing Module
    question_id INT, -- Foreign Key referencing Questions
    score INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (module_id) REFERENCES Module(module_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);
