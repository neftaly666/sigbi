import { Service, signal } from "@angular/core";
import { Patient } from "../model/patient";
import { form } from "@angular/forms/signals";
import { Exam } from "../model/exam";

//Se llama union Type
export interface ConsultWizardFormModel{
    patient: Patient | null;
    consultDate: Date | null;
    exam: Exam | null;
    diagnosis: string;
    treatment: string;
}

const emptyConsultWizard = (): ConsultWizardFormModel => ({
    patient: null,
    consultDate: null,
    exam: null,
    diagnosis: '',
    treatment: ''
});

@Service({autoProvided: false})
export class ConsultWizardForm {

    readonly model = signal<ConsultWizardFormModel>(emptyConsultWizard());
    readonly form = form(this.model);

    value(){
        return this.model();
    }

    reset(){
        this.model.set(emptyConsultWizard());
    }

}