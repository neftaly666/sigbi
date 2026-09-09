import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Specialty } from '../model/specialty';
import { GenericService } from './generic.service';

@Service()
export class SpecialtyService extends GenericService<Specialty> {

    protected override url = `${environment.HOST}/v1/specialties`;

}
