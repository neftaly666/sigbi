import { inject, Service } from "@angular/core";
import { ConsultService } from "../services/consult.service";
import { httpResource } from "@angular/common/http";

@Service({ autoProvided: false })
export class ReportStore {
    private readonly consultService = inject(ConsultService);

    readonly chartDataResource = httpResource<any[]>(() => this.consultService.procedureUrl, { defaultValue: [] });

    readonly $chartData = this.chartDataResource.value;
}