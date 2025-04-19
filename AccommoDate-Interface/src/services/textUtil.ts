import { User } from "../interfaces/User";

export function getAccommodationString(user: User | null): string {
    if (user == null) return "ERROR"
    var acc = "";
    if (user.timeextension > 1) {
        acc += user.timeextension + "x";
        if (user.reader) acc += ", Reader";
        if (user.wordprocessor) acc += ", WP";
        if (user.scribe) acc += ", Scribe";
    } else {
        if (user.reader) {
            acc += "Reader";
        }
        if (user.wordprocessor) {
            if (acc.length > 0) {
                acc += ", WP";
            } else {
                acc += "WP";
            }
        }
        if (user.scribe) {
            if (acc.length > 0) {
                acc += ", Scribe";
            } else {
                acc += "Scribe";
            }
        }

    }
    return acc;

}