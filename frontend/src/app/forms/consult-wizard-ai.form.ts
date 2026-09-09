import { Service, signal } from "@angular/core";
import { form, maxLength, required } from "@angular/forms/signals";
import { Exam } from "../model/exam";
import { Patient } from "../model/patient";

//Limites de columna de ConsultDetail (diagnosis 70 / treatment 150)
export const DIAGNOSIS_MAX_LENGTH = 70;
export const TREATMENT_MAX_LENGTH = 150;

export interface ConsultWizardAiFormModel {
    patient: Patient | null;
    consultDate: Date | null;
    exam: Exam | null;
    diagnosis: string;
    treatment: string;
}

const emptyConsultWizardAi = (): ConsultWizardAiFormModel => ({
    patient: null,
    consultDate: null,
    exam: null,
    diagnosis: '',
    treatment: ''
});

@Service({ autoProvided: false })
export class ConsultWizardAiForm {

    readonly model = signal<ConsultWizardAiFormModel>(emptyConsultWizardAi());

    readonly form = form(this.model, (path) => {
        required(path.patient);
        required(path.consultDate);

        //diagnosis y treatment no son required: se vacian tras cada Add Detail
        maxLength(path.diagnosis, DIAGNOSIS_MAX_LENGTH);
        maxLength(path.treatment, TREATMENT_MAX_LENGTH);
    });

    value() {
        return this.model();
    }

    //limpia solo el par diagnosis/treatment tras agregar un detalle
    clearDetailControls() {
        this.model.update(m => ({ ...m, diagnosis: '', treatment: '' }));
    }

    clearExamControl() {
        this.model.update(m => ({ ...m, exam: null }));
    }

    reset() {
        this.model.set(emptyConsultWizardAi());
    }
}
