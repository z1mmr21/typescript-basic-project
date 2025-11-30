// 1. Basic Types
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// 2. Main Structures
type Professor = {
    id: number;
    name: string;
    department: string;
};

type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// 3. Data Arrays
let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

// 3b. Add Professor
function addProfessor(professor: Professor): void {
    professors.push(professor);
    console.log(`Professor ${professor.name} added.`);
}

// 5a. Conflict Type
type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// 5b. Validate Lesson
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    // Check for Professor Conflict
    const professorConflict = schedule.find(l =>
        l.professorId === lesson.professorId &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot
    );

    if (professorConflict) {
        return {
            type: "ProfessorConflict",
            lessonDetails: professorConflict
        };
    }

    // Check for Classroom Conflict
    const classroomConflict = schedule.find(l =>
        l.classroomNumber === lesson.classroomNumber &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot
    );

    if (classroomConflict) {
        return {
            type: "ClassroomConflict",
            lessonDetails: classroomConflict
        };
    }

    return null;
}

// 3c. Add Lesson
function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.log(`Failed to add lesson. Conflict: ${conflict.type}`);
        return false;
    }
    schedule.push(lesson);
    console.log(`Lesson added for course ${lesson.courseId} at ${lesson.timeSlot} on ${lesson.dayOfWeek}`);
    return true;
}

// 4a. Find Available Classrooms
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedClassrooms = schedule
        .filter(l => l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek)
        .map(l => l.classroomNumber);

    return classrooms
        .filter(c => occupiedClassrooms.indexOf(c.number) === -1)
        .map(c => c.number);
}

// 4b. Get Professor Schedule
function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(l => l.professorId === professorId);
}

// 6a. Get Classroom Utilization
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // 5 days * 5 slots per day
    const occupiedSlots = schedule.filter(l => l.classroomNumber === classroomNumber).length;

    if (totalSlots === 0) return 0;
    return (occupiedSlots / totalSlots) * 100;
}

// 6b. Get Most Popular CourseType
function getMostPopularCourseType(): CourseType {
    const typeCounts: { [key in CourseType]?: number } = {};

    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            typeCounts[course.type] = (typeCounts[course.type] || 0) + 1;
        }
    });

    let maxCount = 0;
    let popularType: CourseType = "Lecture"; // Default

    for (const type in typeCounts) {
        if ((typeCounts[type as CourseType] || 0) > maxCount) {
            maxCount = typeCounts[type as CourseType] || 0;
            popularType = type as CourseType;
        }
    }

    return popularType;
}

// 7a. Reassign Classroom
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lessonIndex = lessonId;
    if (lessonIndex < 0 || lessonIndex >= schedule.length) {
        console.log("Lesson not found.");
        return false;
    }

    const lesson = schedule[lessonIndex];
    const newLesson = { ...lesson, classroomNumber: newClassroomNumber };


    const conflict = schedule.find(l =>
        l.classroomNumber === newClassroomNumber &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot &&
        schedule.indexOf(l) !== lessonIndex
    );

    if (conflict) {
        console.log(`Cannot reassign. Classroom ${newClassroomNumber} is occupied.`);
        return false;
    }

    schedule[lessonIndex] = newLesson;
    console.log(`Lesson ${lessonIndex} reassigned to classroom ${newClassroomNumber}`);
    return true;
}

// 7b. Cancel Lesson
function cancelLesson(lessonId: number): void {
    if (lessonId >= 0 && lessonId < schedule.length) {
        schedule.splice(lessonId, 1);
        console.log(`Lesson ${lessonId} cancelled.`);
    } else {
        console.log("Lesson not found to cancel.");
    }
}


// Initialize Data
professors.push(
    { id: 1, name: "Dr. Smith", department: "Computer Science" },
    { id: 2, name: "Prof. Johnson", department: "Mathematics" }
);

classrooms.push(
    { number: "101", capacity: 30, hasProjector: true },
    { number: "102", capacity: 50, hasProjector: false },
    { number: "201", capacity: 20, hasProjector: true }
);

courses.push(
    { id: 101, name: "Intro to CS", type: "Lecture" },
    { id: 102, name: "Calculus I", type: "Practice" },
    { id: 103, name: "Algorithms", type: "Seminar" }
);

console.log("--- Adding Lessons ---");
addLesson({ courseId: 101, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });
addLesson({ courseId: 102, professorId: 2, classroomNumber: "102", dayOfWeek: "Monday", timeSlot: "10:15-11:45" });

// Conflict: Same professor at same time
console.log("\n--- Testing Professor Conflict ---");
addLesson({ courseId: 103, professorId: 1, classroomNumber: "201", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

// Conflict: Same classroom at same time
console.log("\n--- Testing Classroom Conflict ---");
addLesson({ courseId: 103, professorId: 2, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

console.log("\n--- Available Classrooms ---");
console.log("Available on Monday 8:30-10:00:", findAvailableClassrooms("8:30-10:00", "Monday"));

console.log("\n--- Professor Schedule ---");
console.log("Schedule for Dr. Smith:", getProfessorSchedule(1));

console.log("\n--- Classroom Utilization ---");
console.log("Utilization of 101:", getClassroomUtilization("101") + "%");

console.log("\n--- Most Popular Course Type ---");
console.log("Most popular:", getMostPopularCourseType());

console.log("\n--- Reassign Classroom ---");
reassignClassroom(0, "201");
console.log("Available on Monday 8:30-10:00 after reassign:", findAvailableClassrooms("8:30-10:00", "Monday"));

console.log("\n--- Cancel Lesson ---");
cancelLesson(0);
console.log("Schedule size after cancel:", schedule.length);
