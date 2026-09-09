import { inject, Service } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { ExamService } from "../services/exam.service";
import { MedicService } from "../services/medic.service";
import { PatientService } from "../services/patient.service";
import { Exam } from "../model/exam";
import { Medic } from "../model/medic";
import { Patient } from "../model/patient";

@Service({ autoProvided: false })
export class ConsultWizardAiStore {

    private readonly patientService = inject(PatientService);
    private readonly examService = inject(ExamService);
    private readonly medicService = inject(MedicService);

    readonly patientResource = httpResource<Patient[]>(() => this.patientService.resourceUrl, { defaultValue: [] });
    readonly examResource = httpResource<Exam[]>(() => this.examService.resourceUrl, { defaultValue: [] });
    readonly medicResource = httpResource<Medic[]>(() => this.medicService.resourceUrl, { defaultValue: [] });

    readonly $patients = this.patientResource.value;
    readonly $exams = this.examResource.value;
    readonly $medics = this.medicResource.value;
}
