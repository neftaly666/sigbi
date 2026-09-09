import { Service } from '@angular/core';
import { GenericService } from './generic.service';
import { Consult } from '../model/consult';
import { environment } from '../../environments/environment.development';
import { ConsultListExamDTO } from '../model/consult-list-exam-dto';
import { FilterConsultDTO } from '../model/filter-consult-dto';
import { HttpParams, HttpResourceRequest } from '@angular/common/http';

@Service()
export class ConsultService extends GenericService<Consult> {
  
    protected override url: string = `${environment.HOST}/v1/consults`;
    private readonly consultExamUrl: string = `${environment.HOST}/v1/consultexams`;
    readonly procedureUrl = `${this.url}/callProcedureNative`;

    get consultExamsUrl(){
        return this.consultExamUrl;
    }

    saveTransactional(dto: ConsultListExamDTO) {
        return this.http.post(`${this.url}`, dto);
    }

    //POST con body, httpResource es de solo lectura y no puede expresarlo
    searchByOthers(filter: FilterConsultDTO) {
        return this.http.post<Consult[]>(`${this.url}/search/others`, filter);
    }

    //GET con query params, se entrega como request para que lo consuma el httpResource del store
    searchDates(date1: string, date2: string): HttpResourceRequest {
        const params = new HttpParams()
            .set('date1', date1)
            .set('date2', date2);

        return { url: `${this.url}/search/dates`, params };
    }

    callProcedureOrFunction() {
        return this.http.get<any>(this.procedureUrl);
    }

    //pdf
    generateReport() {
        return this.http.get(`${this.url}/generateReport`, { responseType: 'blob' });
    }
}
