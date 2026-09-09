import { inject, Service } from "@angular/core";
import { SpecialtyService } from "../services/specialty.service";
import { httpResource } from "@angular/common/http";
import { Specialty } from "../model/specialty";

@Service({autoProvided: false})
export class SpecialtyStore{

    private readonly specialtyService = inject(SpecialtyService);

    readonly specialtiesResource = httpResource<Specialty[]>( () => this.specialtyService.resourceUrl, { defaultValue: [] } );

    readonly $specialties = this.specialtiesResource.value;
    readonly $loading = this.specialtiesResource.isLoading;
    readonly $error = this.specialtiesResource.error;

    reload(){
        this.specialtiesResource.reload();
    }
}
