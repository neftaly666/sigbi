import { computed, inject, Service, signal } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { ConsultService } from "../services/consult.service";
import { Exam } from "../model/exam";

@Service({ autoProvided: false })
export class SearchDialogStore {

    private readonly consultService = inject(ConsultService);

    private readonly $idConsult = signal<number | null>(null);

    //Igual que exam-edit.store: inactivo hasta que llega el id
    private readonly $examsRequest = computed(() => {
        const id = this.$idConsult();

        return id ? `${this.consultService.consultExamsUrl}/${id}` : undefined;
    });

    readonly examsResource = httpResource<Exam[]>(() => this.$examsRequest(), { defaultValue: [] });

    readonly $exams = this.examsResource.value;
    readonly $loading = this.examsResource.isLoading;
    readonly $error = this.examsResource.error;

    setIdConsult(idConsult: number | null){
        this.$idConsult.set(idConsult);
    }
}
