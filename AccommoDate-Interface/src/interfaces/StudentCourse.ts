import { Course } from "./Course";
import { User } from "./User";

export interface StudentCourse {
    user: User;
    course: Course;
}