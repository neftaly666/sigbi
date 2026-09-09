import { computed, inject, Service, signal } from "@angular/core";
import { ExamService } from "../services/exam.service";
import { httpResource } from "@angular/common/http";
import { Exam } from "../model/exam";

@Service({ autoProvided: false })
export class ExamEditStore{

    private readonly examService = inject(ExamService);
    readonly $id = signal<number | null>(null);

    private readonly $examRequest = computed(() => {
        const id = this.$id();

        return id ? `${this.examService.resourceUrl}/${id}` : undefined;
    });

    readonly examResource = httpResource<Exam>(() => this.$examRequest());

    setId(id: number | null){
        this.$id.set(id);
    }

    /**
     * 1. Primer effect en exam-edit.component

  - Lee this.$id().
  - Cada vez que cambia el parámetro id de la ruta, Angular vuelve a ejecutar el effect.
  - Ese valor se envía al store con this.examEditStore.setId(this.$id()).

  2. En exam-edit.store

  - setId() actualiza el signal $id.
  - Ese signal alimenta el computed $examRequest.
  - httpResource detecta el cambio y dispara el GET del examen.

  3. Segundo effect en exam-edit.component

  - Observa this.examEditStore.examResource.hasValue().
  - Cuando el recurso ya tiene respuesta, ejecuta this.examForm.patch(...).
  - Eso llena el formulario con los datos cargados.
     */
}