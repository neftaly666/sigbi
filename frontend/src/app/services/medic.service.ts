import { Service } from '@angular/core';
import { GenericService } from './generic.service';
import { Medic } from '../model/medic';
import { environment } from '../../environments/environment.development';

@Service()
export class MedicService extends GenericService<Medic> {

    protected override url = `${environment.HOST}/v1/medics`;

    override save(medic: Medic, file?: File){
        return this.http.post(this.url, this.buildFormData(medic, file));
    }

    override update(id: number, medic: Medic, file?: File){
        return this.http.put(`${this.url}/${id}`, this.buildFormData(medic, file));
    }

    //La parte medic viaja como application/json, el archivo es opcional
    private buildFormData(medic: Medic, file?: File){
        const formData = new FormData();
        formData.append('medic', new Blob([JSON.stringify(medic)], { type: 'application/json' }));

        if(file) formData.append('file', file);

        return formData;
    }
}
