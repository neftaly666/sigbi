import { computed, effect, inject, Service, signal } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { ConsultService } from "../services/consult.service";
import { Consult } from "../model/consult";
import { FilterConsultDTO } from "../model/filter-consult-dto";

interface DateRange {
    date1: string;
    date2: string;
}

@Service({ autoProvided: false })
export class SearchStore {

    private readonly consultService = inject(ConsultService);

    //Unica fuente de la tabla, las dos busquedas escriben aqui
    readonly $consultData = signal<Consult[]>([]);

    private readonly $dateRange = signal<DateRange | undefined>(undefined);

    //Mientras sea undefined el recurso queda inactivo y no lanza ningun request
    private readonly $dateRequest = computed(() => {
        const range = this.$dateRange();

        return range ? this.consultService.searchDates(range.date1, range.date2) : undefined;
    });

    readonly consultsByDateResource = httpResource<Consult[]>(() => this.$dateRequest(), { defaultValue: [] });

    readonly $loading = this.consultsByDateResource.isLoading;
    readonly $error = this.consultsByDateResource.error;

    constructor() {
        //Copia el valor del recurso a la senal comun, solo despues de pedir una busqueda por fechas
        effect(() => {
            if(this.$dateRange() && this.consultsByDateResource.hasValue()){
                this.$consultData.set(this.consultsByDateResource.value());
            }
        });
    }

    searchByDates(date1: string, date2: string){
        this.$dateRange.set({ date1, date2 });
    }

    //httpResource es de solo lectura, el POST pasa por el service y setea la senal en la suscripcion
    searchByOthers(filter: FilterConsultDTO){
        this.consultService.searchByOthers(filter).subscribe((data) => this.$consultData.set(data));
    }
}
