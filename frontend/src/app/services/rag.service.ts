import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';

//No extiende GenericService: detras de /v1/rag no hay un recurso CRUD.
//Base path propio, por eso no es un metodo mas de AgentService
@Service()
export class RagService {

    private readonly http = inject(HttpClient);
    private readonly url = `${environment.HOST}/v1/rag`;

    //RAGController.ragPDF devuelve ResponseEntity<String>: text/plain, no JSON.
    //Sin responseType 'text' el cliente intenta parsear el cuerpo y revienta en el primer caracter
    ask(message: string){
        const params = new HttpParams().set('message', message);

        return this.http.get(this.url, { params, responseType: 'text' });
    }
}
