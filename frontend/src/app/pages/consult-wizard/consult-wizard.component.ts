import { Component, computed, inject, signal, viewChild } from '@angular/core';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { ConsultWizardForm } from '../../forms/consult-wizard.form';
import { FormRoot, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ConsultWizardStore } from '../../store/consult-wizard.store';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CustomDateAdapter } from '../../material/custom-adapter';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { ConsultDetail } from '../../model/consult-detail';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { Exam } from '../../model/exam';
import { Medic } from '../../model/medic';
import { NgClass } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consult } from '../../model/consult';
import { ConsultListExamDTO } from '../../model/consult-list-exam-dto';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-consult-wizard',
  imports: [
    MatStepperModule,
    FormRoot,
    FormField,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatListModule,
    MatCardModule,
    NgClass,
    MatGridListModule
],
  templateUrl: './consult-wizard.component.html',
  styleUrl: './consult-wizard.component.css',
  providers: [ 
    ConsultWizardForm, 
    ConsultWizardStore,
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class ConsultWizardComponent {
  
    protected readonly consultWizardForm = inject(ConsultWizardForm);
    protected readonly consultWizardStore = inject(ConsultWizardStore);
    private readonly snackBar = inject(MatSnackBar);
    private readonly consultService= inject(ConsultService);

    protected $patients = this.consultWizardStore.$patients;
    protected $exams = this.consultWizardStore.$exams;
    protected $medics = this.consultWizardStore.$medics;

    protected minDate = new Date();
    protected $details = signal<ConsultDetail[]>([]);
    protected $examsSelected = signal<Exam[]>([]);
    protected $medicSelected = signal<Medic>(null);
    protected $consultArray = signal<number[]>(Array.from({length: 100}, (_, i) => i + 1));
    protected $consultSelected = signal<number>(0);
    protected $stepper = viewChild<MatStepper>('stepper');

    //Para el paso3 - review
    protected $patientFullname = computed(() => {
      const p = this.consultWizardForm.model().patient;
      return p ? `${p.firstName} ${p.lastName}` : 'No patient selected';
    });

    protected $medicFullname = computed(() => {
      const m = this.$medicSelected();
      return m ? `${m.primaryName} ${m.surname}` : 'No medic selected';
    });

    protected $consultNumberLabel = computed(() => `C${this.$consultSelected()}`);

    protected $dateLabel = computed(() => {
      const d = this.consultWizardForm.model().consultDate;
      return d ? d.toLocaleDateString() : 'No date selected';
    });

    //Para el autocomplete de examenes
    protected $examsFiltered = computed(() => {
      const val = this.consultWizardForm.model().exam;
      const exams = this.$exams();
      return this.filterExams(val, exams);
    });

    private filterExams(val: any, exams: Exam[]){
      const term = (val?.nameExam || val || '').toString().toLowerCase();
      return exams.filter(
      (el) =>
        el.nameExam.toLowerCase().includes(term) || el.descriptionExam.toLowerCase().includes(term),
    );
    }

    showExam(exam: Exam){
      return exam ? exam.nameExam : '';
    }

    addDetail(){
      const det = new ConsultDetail();
      det.diagnosis = this.consultWizardForm.value().diagnosis;
      det.treatment = this.consultWizardForm.value().treatment;
      
      //in-place mutation of the signal value | bad practice
      //this.$details().push(det);      
      //this.$details.set([...this.$details(), det]);
      this.$details.update(details => [...details, det]);
    }

    removeDetail(index: number){
      //in-place mutation of the signal value | bad practice
      //this.$details().splice(index, 1);
      //this.$details.set(this.$details().filter((_, i) => i !== index));
      this.$details.update(details => details.filter((_, i) => i !== index));
    }

    addExam(){
      const exam = this.consultWizardForm.value().exam;
      this.$examsSelected.update(exams => [...exams, exam]);
    }

    removeExam(index: number){
      this.$examsSelected.update(exams => exams.filter((_, i) => i !== index));
    }

    selectMedic(m : Medic){
      this.$medicSelected.set(m);
      //this.$medicSelected.update(prev => m);
    }

    selectConsult(n : number){
      this.$consultSelected.set(n);
    }

    nextManualStep(){
      if(this.$consultSelected() > 0){
        this.$stepper().next();
      }else{
        this.snackBar.open('Please select a consult number', 'INFO', {
          duration: 3000,
        });
      }
    }

    save(){
      const formValue = this.consultWizardForm.value();
      const consult = new Consult();
      consult.patient = formValue.patient;
      consult.medic = this.$medicSelected();
      consult.numConsult = this.$consultNumberLabel();
      consult.details = this.$details();
      consult.idUser = 1; //TODO: get the user from the session
      consult.consultDate = formValue.consultDate.toISOString();

      const dto: ConsultListExamDTO = {
        consult: consult,
        lstExam: this.$examsSelected()
      }
      
      this.consultService.saveTransactional(dto).subscribe(()=> {
        this.snackBar.open('Consult saved successfully', 'INFO', {
          duration: 3000,
        });

        setTimeout(() => {
          this.cleanControls();
        }, 3000);
      });
    }

    cleanControls(){
      this.consultWizardForm.reset();
      this.$stepper().reset();
      this.$details.set([]);
      this.$examsSelected.set([]);
      this.$medicSelected.set(null);
      this.$consultSelected.set(0);
    }
}
