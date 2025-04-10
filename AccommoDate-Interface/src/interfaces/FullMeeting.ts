import { Meeting } from "./Meeting";
import { User } from "./User";

export interface FullMeeting {
    user: User;
    admin: User;
    meeting: Meeting;
}