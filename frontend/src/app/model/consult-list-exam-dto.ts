import { Consult } from "./consult";
import { Exam } from "./exam";

export interface ConsultListExamDTO {
    consult: Consult;
    lstExam: Exam[];
}