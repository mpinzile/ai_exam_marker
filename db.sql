CREATE TABLE course (
    course_id INT PRIMARY KEY  AUTO_INCREMENT,
    course_name VARCHAR(255)
);

CREATE TABLE level (
    level_id INT PRIMARY KEY AUTO_INCREMENT,
    level_name VARCHAR(255)
);

CREATE TABLE teacher (
    teacher_id INT PRIMARY KEY  AUTO_INCREMENT,
    teacher_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255) -- Ideally, store hashed passwords
);

CREATE TABLE module (
    module_id INT PRIMARY KEY  AUTO_INCREMENT,
    module_name VARCHAR(255),
    course_id INT, -- Foreign Key referencing courses
    level_id INT, -- Foreign Key referencing levels
    teacher_id INT, -- Foreign Key referencing teacher
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (level_id) REFERENCES level(level_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id)
);

CREATE TABLE questions (
    question_id INT PRIMARY KEY  AUTO_INCREMENT,
    question_content TEXT,
    question_type VARCHAR(10), -- open_ended/multiple choice/ture-false
    marks INT,
    module_id INT, -- Foreign Key referencing modules
    FOREIGN KEY (module_id) REFERENCES module(module_id)
);

CREATE TABLE answers (
    answer_id INT PRIMARY KEY  AUTO_INCREMENT,
    question_id INT, -- Foreign Key referencing questions
    answer_content TEXT,
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE questionchoices (
    choice_id INT PRIMARY KEY  AUTO_INCREMENT,
    choice_content TEXT,
    question_id INT, -- Foreign Key referencing questions
    is_correct BOOLEAN,
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);


CREATE TABLE student (
    student_id INT PRIMARY KEY  AUTO_INCREMENT,
    admission_number VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    course_id INT, -- Foreign Key referencing courses
    level_id INT, -- Foreign Key referencing levels
    password VARCHAR(255), -- Ideally, store hashed passwords
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (level_id) REFERENCES level(level_id)
);

CREATE TABLE generalscore (
    score_id INT PRIMARY KEY  AUTO_INCREMENT,
    student_id INT, -- Foreign Key referencing student
    module_id INT, -- Foreign Key referencing module
    total_score INT,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (module_id) REFERENCES module(module_id)
);

CREATE TABLE questionscore (
    qn_score_id INT PRIMARY KEY  AUTO_INCREMENT,
    student_id INT, -- Foreign Key referencing student
    module_id INT, -- Foreign Key referencing module
    question_id INT, -- Foreign Key referencing questions
    score INT,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (module_id) REFERENCES module(module_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);
