enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface GradeEntry {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeEntry[] = [];
    private registrations: { studentId: number; courseId: number }[] = [];
    private studentIdCounter = 1;

    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.studentIdCounter++
        };
        this.students.push(newStudent);
        return newStudent;
    }

    addCourse(course: Course): void {
        this.courses.push(course);
    }

    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student || !course) {
            throw new Error("Student or Course not found");
        }

        if (student.faculty !== course.faculty) {
            throw new Error("Student faculty does not match course faculty");
        }

        const currentRegistrations = this.registrations.filter(r => r.courseId === courseId).length;
        if (currentRegistrations >= course.maxStudents) {
            throw new Error("Course is full");
        }

        this.registrations.push({ studentId, courseId });
    }

    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const isRegistered = this.registrations.some(r => r.studentId === studentId && r.courseId === courseId);
        if (!isRegistered) {
            throw new Error("Student is not registered for this course");
        }

        const course = this.courses.find(c => c.id === courseId);
        if (!course) {
            throw new Error("Course not found");
        }

        const newGrade: GradeEntry = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        this.grades.push(newGrade);
    }

    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            throw new Error("Student not found");
        }

        if (student.status === StudentStatus.Expelled && newStatus === StudentStatus.Active) {
            throw new Error("Cannot reinstate expelled student directly");
        }

        student.status = newStatus;
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    getStudentGrades(studentId: number): GradeEntry[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }

    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.grades.filter(g => g.studentId === studentId);
        if (studentGrades.length === 0) return 0;

        const sum = studentGrades.reduce((acc, g) => acc + g.grade, 0);
        return sum / studentGrades.length;
    }

    getTopStudentsByFaculty(faculty: Faculty): Student[] {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        return facultyStudents.filter(s => {
            const avg = this.calculateAverageGrade(s.id);
            return avg === 5;
        });
    }
}

const system = new UniversityManagementSystem();

const student1 = system.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS-101"
});

const course1: Course = {
    id: 1,
    name: "Introduction to Programming",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30
};

system.addCourse(course1);

try {
    system.registerForCourse(student1.id, course1.id);
    system.setGrade(student1.id, course1.id, Grade.Excellent);
    console.log("Student grades:", system.getStudentGrades(student1.id));
    console.log("Average grade:", system.calculateAverageGrade(student1.id));
} catch (e) {
    console.error(e);
}
