import { Component, computed, effect, inject } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExamForm } from '../../../forms/exam.form';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamEditStore } from '../../../store/exam-edit.store';
import { Exam } from '../../../model/exam';
import { ExamService } from '../../../services/exam.service';
import { ExamStore } from '../../../store/exam.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-exam-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormField,
    FormRoot,
    RouterLink
],
  templateUrl: './exam-edit.component.html',
  styleUrl: './exam-edit.component.css',
  providers: [ ExamForm, ExamEditStore ]
})
export class ExamEditComponent {

  protected readonly examForm = inject(ExamForm);
  private readonly route = inject(ActivatedRoute);
  private readonly examEditStore = inject(ExamEditStore);
  private readonly examStore = inject(ExamStore);
  private readonly examService = inject(ExamService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => {
    const id = this.$params()['id'];
    return id ? Number(id) : null;
  });
  protected $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      //Cada vez que se cambie $id, se ejecutará este efecto
      //Llamar al store de edit
      this.examEditStore.setId(this.$id());
    });

    // Cuando llega el examResource, se copia al formulario.
    effect(()=> {
      if(this.examEditStore.examResource.hasValue()){
        this.examForm.patch(this.examEditStore.examResource.value());
      }
    });
  }

  operate(){
    if(this.examForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();    
    const exam: Exam = this.examForm.value();

    const operation$ = isEdit ? this.examService.update(id, exam) : this.examService.save(exam);

    operation$.subscribe( ()=> {
      this.examStore.reload();
      this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
      this.router.navigate(['/pages/exam']);
    });


  }
}
