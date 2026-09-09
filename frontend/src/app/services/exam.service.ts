import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Exam } from '../model/exam';
import { GenericService } from './generic.service';

@Service()
//@Injectable({ providedIn: 'root' })
export class ExamService extends GenericService<Exam> {
    
    protected override url = `${environment.HOST}/v1/exams`;
    //private http = inject(HttpClient);

    //constructor(private http: HttpClient) {}

    /*findAll(){
        return this.http.get<Exam[]>(this.url);
    }*/   
    
}
