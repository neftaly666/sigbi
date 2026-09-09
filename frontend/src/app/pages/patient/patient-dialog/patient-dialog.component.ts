import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PatientForm } from '../../../forms/patient.form';
import { Patient } from '../../../model/patient';
import { PatientService } from '../../../services/patient.service';
import { PatientDialogStore } from '../../../store/patient-dialog.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-patient-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormField,
    FormRoot
],
  templateUrl: './patient-dialog.component.html',
  styleUrl: './patient-dialog.component.css',
  providers: [ PatientForm, PatientDialogStore ]
})
export class PatientDialogComponent {

  protected readonly patientForm = inject(PatientForm);
  private readonly patientDialogStore = inject(PatientDialogStore);
  private readonly patientService = inject(PatientService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<PatientDialogComponent>);
  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });

  protected $id = computed(() => this.data ? Number(this.data) : null);
  protected $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      //Cada vez que se cambie $id, se ejecutará este efecto
      //Llamar al store del dialogo
      this.patientDialogStore.setId(this.$id());
    });

    // Cuando llega el patientResource, se copia al formulario.
    effect(() => {
      if(this.patientDialogStore.patientResource.hasValue()){
        this.patientForm.patch(this.patientDialogStore.patientResource.value());
      }
    });
  }

  operate(){
    if(this.patientForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const patient: Patient = this.patientForm.value();

    const operation$ = isEdit ? this.patientService.update(id, patient) : this.patientService.save(patient);

    operation$.subscribe(() => {
      this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
      this.dialogRef.close(true);
    });
  }

  cancel(){
    this.dialogRef.close(false);
  }
}
