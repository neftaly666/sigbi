import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BotResponse } from '../model/bot-response';

//No extiende GenericService: detras de /v1/agents no hay un recurso CRUD
@Service()
export class AgentService {

    private readonly http = inject(HttpClient);
    private readonly url = `${environment.HOST}/v1/agents`;

    //Sin responseType, el generico ya dice que el cuerpo es JSON y 'json' es el valor por defecto
    askMedicalBot(message: string, conversationId: string){
        const params = new HttpParams()
            .set('message', message)
            .set('conversationId', conversationId);

        return this.http.get<BotResponse>(`${this.url}/ask-medical-bot`, { params });
    }
}
