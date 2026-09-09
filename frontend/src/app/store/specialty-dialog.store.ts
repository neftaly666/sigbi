import { computed, inject, Service, signal } from "@angular/core";
import { SpecialtyService } from "../services/specialty.service";
import { httpResource } from "@angular/common/http";
import { Specialty } from "../model/specialty";

@Service({ autoProvided: false })
export class SpecialtyDialogStore{

    private readonly specialtyService = inject(SpecialtyService);
    readonly $id = signal<number | null>(null);

    private readonly $specialtyRequest = computed(() => {
        const id = this.$id();

        return id ? `${this.specialtyService.resourceUrl}/${id}` : undefined;
    });

    readonly specialtyResource = httpResource<Specialty>(() => this.$specialtyRequest());

    setId(id: number | null){
        this.$id.set(id);
    }
}
