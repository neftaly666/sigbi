import { computed, inject, Service, signal } from "@angular/core";
import { PatientService } from "../services/patient.service";
import { httpResource } from "@angular/common/http";
import { Patient } from "../model/patient";
import { emptyPageResponse, PageResponse } from "../shared/models/page-response";

@Service({autoProvided: false})
export class PatientStore{

    private readonly patientService = inject(PatientService);
    readonly $pageRequest = signal({ page: 0, size: 2});

    //readonly patientsResource = httpResource<Patient[]>( () => this.patientService.resourceUrl, { defaultValue: [] } );
    readonly patientsResource = httpResource<PageResponse<Patient>>(
    () => ({
      url: `${this.patientService.resourceUrl}/pageable`,
      params: {
        page: this.$pageRequest().page,
        size: this.$pageRequest().size,
      },
    }),
    {
      defaultValue: emptyPageResponse<Patient>(),
    },
  );

    readonly $patients = computed(() => this.patientsResource.value().content);
    readonly $totalElements = computed(() => this.patientsResource.value().page.totalElements);
    readonly $loading = this.patientsResource.isLoading;
    readonly $error = this.patientsResource.error;

    change(page: number, size: number){
        this.$pageRequest.set({ page, size });
    }

    reload(){
        this.patientsResource.reload();
    }
}
