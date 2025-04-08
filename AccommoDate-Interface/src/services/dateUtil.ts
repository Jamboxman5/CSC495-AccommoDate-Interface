export function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
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