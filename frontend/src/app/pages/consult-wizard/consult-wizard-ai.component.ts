import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { CustomDateAdapter } from '../../material/custom-adapter';
import { ConsultWizardAiForm, DIAGNOSIS_MAX_LENGTH, TREATMENT_MAX_LENGTH } from '../../forms/consult-wizard-ai.form';
import { ConsultWizardAiStore } from '../../store/consult-wizard-ai.store';
import { Consult } from '../../model/consult';
import { ConsultDetail } from '../../model/consult-detail';
import { ConsultListExamDTO } from '../../model/consult-list-exam-dto';
import { Exam } from '../../model/exam';
import { Medic } from '../../model/medic';
import { ConsultService } from '../../services/consult.service';

//TODO: reemplazar por el usuario autenticado cuando exista login. Unico lugar donde se fija.
const ID_USER = 1;

//Consult.numConsult es @Column(length = 3), C100 no entra: la grilla se detiene en 99
const MAX_CONSULT_NUMBER = 99;

@Component({
  selector: 'app-consult-wizard-ai',
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
  templateUrl: './consult-wizard-ai.component.html',
  styleUrl: './consult-wizard-ai.component.css',
  providers: [
    ConsultWizardAiForm,
    ConsultWizardAiStore,
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class ConsultWizardAiComponent {

  protected readonly consultWizardForm = inject(ConsultWizardAiForm);
  protected readonly consultWizardStore = inject(ConsultWizardAiStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly consultService = inject(ConsultService);

  protected readonly $patients = this.consultWizardStore.$patients;
  protected readonly $exams = this.consultWizardStore.$exams;
  protected readonly $medics = this.consultWizardStore.$medics;

  protected readonly diagnosisMaxLength = DIAGNOSIS_MAX_LENGTH;
  protected readonly treatmentMaxLength = TREATMENT_MAX_LENGTH;

  protected minDate = new Date();
  protected $details = signal<ConsultDetail[]>([]);
  protected $examsSelected = signal<Exam[]>([]);
  protected $medicSelected = signal<Medic>(null);
  protected $consultArray = signal<number[]>(Array.from({ length: MAX_CONSULT_NUMBER }, (_, i) => i + 1));
  protected $consultSelected = signal<number>(0);
  protected $stepper = viewChild<MatStepper>('stepper');

  //Paso 3 - review
  protected $patientFullname = computed(() => {
    const p = this.consultWizardForm.model().patient;
    return p ? `${p.firstName} ${p.lastName}` : 'No patient selected';
  });

  protected $medicFullname = computed(() => {
    const m = this.$medicSelected();
    return m ? `${m.primaryName} ${m.surname}` : 'No medic selected';
  });

  protected $consultNumberLabel = computed(() => this.$consultSelected() > 0 ? `C${this.$consultSelected()}` : 'No number selected');

  protected $dateLabel = computed(() => {
    const d = this.consultWizardForm.model().consultDate;
    return d ? d.toLocaleDateString() : 'No date selected';
  });

  //Save solo cuando todo lo obligatorio esta presente: consultDate nunca se desreferencia en null
  protected $canSave = computed(() => {
    const value = this.consultWizardForm.model();
    return !!value.patient
      && !!value.consultDate
      && !!this.$medicSelected()
      && this.$consultSelected() > 0
      && this.$details().length > 0;
  });

  protected $canAddDetail = computed(() => {
    const value = this.consultWizardForm.model();
    const diagnosis = (value.diagnosis ?? '').trim();
    const treatment = (value.treatment ?? '').trim();

    return diagnosis.length > 0 && diagnosis.length <= DIAGNOSIS_MAX_LENGTH
      && treatment.length > 0 && treatment.length <= TREATMENT_MAX_LENGTH;
  });

  //Autocomplete de examenes
  protected $examsFiltered = computed(() => {
    const val = this.consultWizardForm.model().exam;
    const exams = this.$exams();
    return this.filterExams(val, exams);
  });

  private filterExams(val: any, exams: Exam[]) {
    const term = (val?.nameExam || val || '').toString().toLowerCase();
    return exams.filter(
      (el) =>
        el.nameExam.toLowerCase().includes(term) || el.descriptionExam.toLowerCase().includes(term),
    );
  }

  showExam(exam: Exam) {
    return exam ? exam.nameExam : '';
  }

  addDetail() {
    if (!this.$canAddDetail()) {
      this.snackBar.open('Please complete diagnosis and treatment', 'INFO', { duration: 3000 });
      return;
    }

    const value = this.consultWizardForm.value();
    const det = new ConsultDetail();
    det.diagnosis = value.diagnosis.trim();
    det.treatment = value.treatment.trim();

    this.$details.update(details => [...details, det]);
    this.consultWizardForm.clearDetailControls();
  }

  removeDetail(index: number) {
    this.$details.update(details => details.filter((_, i) => i !== index));
  }

  addExam() {
    const exam = this.consultWizardForm.value().exam;

    //el autocomplete puede tener texto libre mientras se escribe
    if (!exam || !exam.idExam) {
      this.snackBar.open('Please select an exam from the list', 'INFO', { duration: 3000 });
      return;
    }

    //consult_exam tiene PK compuesta: un duplicado seria un 500, se ignora en el cliente
    if (this.$examsSelected().some(ex => ex.idExam === exam.idExam)) {
      return;
    }

    this.$examsSelected.update(exams => [...exams, exam]);
    this.consultWizardForm.clearExamControl();
  }

  removeExam(index: number) {
    this.$examsSelected.update(exams => exams.filter((_, i) => i !== index));
  }

  selectMedic(m: Medic) {
    this.$medicSelected.set(m);
  }

  selectConsult(n: number) {
    this.$consultSelected.set(n);
  }

  nextManualStep() {
    if (this.$consultSelected() > 0) {
      this.$stepper().next();
    } else {
      this.snackBar.open('Please select a consult number', 'INFO', {
        duration: 3000,
      });
    }
  }

  save() {
    if (!this.$canSave()) {
      this.snackBar.open('Patient, date, medic, consult number and at least one detail are required', 'INFO', { duration: 3000 });
      return;
    }

    const formValue = this.consultWizardForm.value();
    const consult = new Consult();
    consult.patient = formValue.patient;
    consult.medic = this.$medicSelected();
    consult.numConsult = `C${this.$consultSelected()}`;
    consult.details = this.$details();
    consult.idUser = ID_USER;
    //LocalDateTime en el backend: se envia sin zona horaria (nada de toISOString)
    consult.consultDate = this.toLocalDateTime(formValue.consultDate);

    const dto: ConsultListExamDTO = {
      consult: consult,
      lstExam: this.$examsSelected()
    };

    this.consultService.saveTransactional(dto).subscribe({
      next: () => {
        this.snackBar.open('Consult saved successfully', 'INFO', { duration: 3000 });
        this.cleanControls();
      },
      error: () => {
        this.snackBar.open('The consult could not be saved', 'ERROR', { duration: 3000 });
      }
    });
  }

  //YYYY-MM-DDTHH:mm:ss en hora local
  private toLocalDateTime(date: Date): string {
    const pad = (n: number) => `${n}`.padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
      + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  cleanControls() {
    this.consultWizardForm.reset();
    this.$stepper().reset();
    this.$details.set([]);
    this.$examsSelected.set([]);
    this.$medicSelected.set(null);
    this.$consultSelected.set(0);
  }
}
