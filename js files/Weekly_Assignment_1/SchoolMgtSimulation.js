// // 7.School Management System Simulation
// // Assignment:
// // Simulate a school with students, teachers, classes, and grading — using Node.js and
// // OOP.
// // Requirements:
// // ● Classes: Student, Teacher, Classroom, Grade
// // ● Create:
// // ○ 5 Teachers
// // ○ 10 Classes
// // ○ 30 Students
// // ● Assign students to classes
// // ● Assign teachers to subjects
// // ● Randomly generate test scores and grades
// // 📈 Output:
// // ● Top 5 students by average grade
// // ● Teacher with highest student average
// // ● List of students per class with performance




class Student {
    constructor(id, name, age, classId) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.classId = classId;
      this.grades = []; // stores { subject, score }
    }
  
    addGrade(subject, score) {
      this.grades.push({ subject, score });
    }
  
    getAverageGrade() {
      const total = this.grades.reduce((sum, g) => sum + g.score, 0); // total of all subject scores
      return this.grades.length ? total / this.grades.length :0     // average = total / number of grades
    }
  }
  
  class Teacher {
    constructor(id, name, subject) {
      this.id = id;
      this.name = name;
      this.subject = subject;
      this.classIds = []; // classes assigned to teacher
    }
  
    // Assign a class to this teacher
    assignClassToTeacher(classId) {
      this.classIds.push(classId);
    }
  }
  
  class Classroom {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.students = [];
    }
  
    // Add a student to this class
    addStudent(student) {
      this.students.push(student);
    }
  
    // Calculate average grade of all students in this class
    getAverageClassGrade() {
      const total = this.students.reduce((sum, s) => sum + s.getAverageGrade(), 0); // toal of all students average grades
      return this.students.length ? total / this.students.length : 0;               // class average = total / student count
    }
  }
  //sample teacher records 
  const teachers = [
    new Teacher(1, "deepak iyer", "math"),
    new Teacher(2, "anita khanna", "science"),
    new Teacher(3, "rohit chavan", "english"),
    new Teacher(4, "sneha rao", "social studies"),
    new Teacher(5, "vikas sharma", "computer science"),
  ];
  
  //  10 classes
  const classes = [];
  for (let i = 0; i < 10; i++) {
    classes.push(new Classroom(i + 1, `class-${i + 1}`)); // class id = i+1, name = class-1 to class-10
  }
  
  // Creating 30 students
  const students = [];
  let id = 1;
  
  for (let i = 0; i < 30; i++) {
    const classId = (i % 10) + 1; // Distributed students into 10 classes (1 to 10)
    const s = new Student(id, `student-${id}`, 13 + (i % 6), classId); // Age is random between 13 to 18

    // Add grades (random between 60 to 100)
    s.addGrade("math", Math.floor(Math.random() * 41) + 60);    // random between 60–100
    s.addGrade("science", Math.floor(Math.random() * 41) + 60);
    s.addGrade("english", Math.floor(Math.random() * 41) + 60);
    students.push(s);
    classes[classId - 1].addStudent(s); // Add student to the  classroom
    id++;       
  }
  
  // Assign each teacher to a class
  teachers.forEach((teacher, index) => {
    const classId = index + 1; // teacher 0 → class 1, teacher 1 → class 2....
    teacher.assignClassToTeacher(classId);
  });
  
  
  // Top 5 students by average grade
  const top5 = [...students]
    .sort((a, b) => b.getAverageGrade() - a.getAverageGrade()) // Sorting descending by average grade
    .slice(0, 5); // Getting first 5 students
  
  console.log(" Top 5 Students:");
  top5.forEach(s => {
    console.log(`${s.name} - Avg Grade: ${s.getAverageGrade().toFixed(2)}`);
  });
  
  // Find the teacher with the highest student average
  let bestTeacher = null;
  let highestAvg = 0;
  
  teachers.forEach(t => {
    // finding students assigned to the classes this teacher handles
    const relevantStudents = students.filter(s => t.classIds.includes(s.classId));
    
    // calculating average of these students
    const avg = relevantStudents.reduce((sum, s) => sum + s.getAverageGrade(), 0) /
                (relevantStudents.length || 1); // avoid division by 0
  
    // checking if this average is the highest so far
    if (avg > highestAvg) {
      highestAvg = avg;
      bestTeacher = t;
    }
  });
  
  console.log(`\n Teacher with Highest Student Avg: ${bestTeacher.name} (${highestAvg.toFixed(2)})`);
  
  // Print students per class with their performance
  console.log("\n Class-wise Student Performance:");
  classes.forEach(c => {
    console.log(`\n${c.name}`);
    c.students.forEach(s => {
      console.log(`- ${s.name} | Avg: ${s.getAverageGrade().toFixed(2)}`);
    });
  });
  