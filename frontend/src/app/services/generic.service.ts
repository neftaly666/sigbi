import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { contextoDeFormulario } from '../shared/http/form-error.context';

@Service({autoProvided: false})
export abstract class GenericService<T> {
    protected http = inject(HttpClient);
    protected abstract url: string;

    get resourceUrl(){
        return this.url;
    }

    findAll(){
        return this.http.get<T[]>(this.url);
    }

    findById(id: number){
        return this.http.get<T>(`${this.url}/${id}`);
    }

    save(t: T){
        return this.http.post(this.url, t);
    }

    update(id: number, t: T){
        return this.http.put(`${this.url}/${id}`, t);
    }

    //Variantes para los dialogos: marcan la petición para que el interceptor devuelva el
    //400 en vez de convertirlo en un aviso genérico, y así el error se pinta bajo su campo
    //(PX-04, ver form-error.context.ts). Métodos aparte y no un parámetro opcional de
    //save/update: en la llamada se lee que ese formulario quiere el error de vuelta.
    saveWithFormErrors(t: T){
        return this.http.post(this.url, t, { context: contextoDeFormulario() });
    }

    updateWithFormErrors(id: number, t: T){
        return this.http.put(`${this.url}/${id}`, t, { context: contextoDeFormulario() });
    }

    delete(id: number){
        return this.http.delete(`${this.url}/${id}`);
    }
}
