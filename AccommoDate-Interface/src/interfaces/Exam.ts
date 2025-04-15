export interface Exam {
    examid: string;
    crn: number;
    examdate: string;
    examtime: string;
    studentid: string;
    examlocation: string;
    examconfirmed: boolean;
    examcomplete: boolean;
    examonline: boolean;
    examrequested: boolean;
    examduration: number;
    note: string;
}