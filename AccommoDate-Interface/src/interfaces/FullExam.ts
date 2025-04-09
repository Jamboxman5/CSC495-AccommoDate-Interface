import { Exam } from "./Exam";
import { Course } from "./Course";
import { User } from "./User";
export interface FullExam {
    exam: Exam;
    user: User;
    course: Course;
}