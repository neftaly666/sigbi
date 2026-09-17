import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';

export interface AssistantResponse {
    content: string;
    configured: boolean;
}

//No extiende GenericService: detrás de /v1/agents no hay un recurso CRUD, hay un solo POST
@Service()
export class AssistantService {

    private readonly http = inject(HttpClient);
    private readonly url = `${environment.HOST}/v1/agents`;

    ask(message: string, conversationId: string) {
        return this.http.post<AssistantResponse>(this.url, { message, conversationId });
    }
}
