import { computed, inject, Service, signal } from "@angular/core";
import { PatientService } from "../services/patient.service";
import { httpResource } from "@angular/common/http";
import { Patient } from "../model/patient";

@Service({ autoProvided: false })
export class PatientDialogStore{

    private readonly patientService = inject(PatientService);
    readonly $id = signal<number | null>(null);

    private readonly $patientRequest = computed(() => {
        const id = this.$id();

        return id ? `${this.patientService.resourceUrl}/${id}` : undefined;
    });

    readonly patientResource = httpResource<Patient>(() => this.$patientRequest());

    setId(id: number | null){
        this.$id.set(id);
    }
}
