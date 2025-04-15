export function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    export function formatPrettyDate(date: string): string {
        const parts = date.split('-');
        const year = parts[0];
        var month = parts[1];
        if (month.startsWith("0")) month = month.charAt(1);
        var day = parts[2];
        if (day.startsWith("0")) day = day.charAt(1);
        return `${month}/${day}/${year}`
    }

    export function formatYearlessPrettyDate(date: string): string {
        const parts = date.split('-');
        var month = parts[1];
        if (month.startsWith("0")) month = month.charAt(1);
        var day = parts[2];
        if (day.startsWith("0")) day = day.charAt(1);
        return `${month}/${day}`
    }

    export function getMonday(date: Date): Date {
        var weekday = date.getDay();
        date.setDate(date.getDate() - weekday + 1)
        return date;
    }

    export function getWeekDay(date: Date, day: number): string {
        console.log(date)
        var weekday = date.getDay();
        console.log(weekday)
        date.setDate(date.getDate() - weekday + day)
        
        return date.toLocaleDateString(undefined, {
            weekday: "long"
        }) + " " + formatYearlessPrettyDate(formatDate(date));
    }

    export function formatWeekDate(dateStr: string): string {
        const [year, month, day] = dateStr.split("-").map(Number);
        const localDate = new Date(year, month - 1, day); // month is 0-indexed
        return localDate.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      export function formatTime(time: string): string {
        const timeSplit = time.split(":");
                    const timeDate = new Date();
                    timeDate.setHours(Number(timeSplit[0]), Number(timeSplit[1]))
        return timeDate.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
        })
      }

      export function getFormattedTime(time: String): String {
        const timeSplit = time.split(":");
        const dateTime = new Date();
        dateTime.setHours(Number(timeSplit[0]), Number(timeSplit[1]));

        return dateTime.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
        })

      }

      export function getCourseEndTime(startTime: string, minutes: number): string {

        const timeSplit = startTime.split(":");
        const dateTime = new Date();
        dateTime.setHours(Number(timeSplit[0]), Number(timeSplit[1]));

        minutes += dateTime.getMinutes();
        const hours = Math.trunc(minutes/60);
        const mins = Math.round(minutes%60);
        dateTime.setHours(dateTime.getHours() + hours, mins);
        return dateTime.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
        });
      }

      export function formatMinutes(minutes: number): string {
        const hours = Math.trunc(minutes/60);
        const mins = Math.round(minutes%60);
        if (hours >= 2) {
            if (mins > 1) {
                return hours + " hours, " + mins + " minutes";

            } else if (mins == 1) {
                return hours + " hours, " + mins + " minute";
            } else {
                return hours + " hours"
            }
        } else if (hours >= 1) {
            if (mins > 1) {
                return hours + " hour, " + mins + " minutes";

            } else if (mins == 1) {
                return hours + " hour, " + mins + " minute";
            } else {
                return hours + " hour"
            }
        } else {
            return mins + " minutes";
        }
      }