import { inject, Service } from "@angular/core";
import { MedicService } from "../services/medic.service";
import { Medic } from "../model/medic";
import { httpResource } from "@angular/common/http";

@Service({ autoProvided: false})
export class MedicStore{

    private readonly medicService = inject(MedicService);

    readonly medicsResource = httpResource<Medic[]>(() => this.medicService.resourceUrl, { defaultValue: [] });
    
    readonly $medics = this.medicsResource.value;
    readonly $loading = this.medicsResource.isLoading;
    readonly $error = this.medicsResource.error;

    reload(){
        this.medicsResource.reload();
    }
}