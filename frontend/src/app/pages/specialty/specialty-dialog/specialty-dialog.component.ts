import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SpecialtyForm } from '../../../forms/specialty.form';
import { Specialty } from '../../../model/specialty';
import { SpecialtyService } from '../../../services/specialty.service';
import { SpecialtyDialogStore } from '../../../store/specialty-dialog.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-specialty-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormField,
    FormRoot
],
  templateUrl: './specialty-dialog.component.html',
  styleUrl: './specialty-dialog.component.css',
  providers: [ SpecialtyForm, SpecialtyDialogStore ]
})
export class SpecialtyDialogComponent {

  protected readonly specialtyForm = inject(SpecialtyForm);
  private readonly specialtyDialogStore = inject(SpecialtyDialogStore);
  private readonly specialtyService = inject(SpecialtyService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<SpecialtyDialogComponent>);
  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });

  protected $id = computed(() => this.data ? Number(this.data) : null);
  protected $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      //Cada vez que se cambie $id, se ejecutará este efecto
      //Llamar al store del dialogo
      this.specialtyDialogStore.setId(this.$id());
    });

    // Cuando llega el specialtyResource, se copia al formulario.
    effect(() => {
      if(this.specialtyDialogStore.specialtyResource.hasValue()){
        this.specialtyForm.patch(this.specialtyDialogStore.specialtyResource.value());
      }
    });
  }

  operate(){
    if(this.specialtyForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const specialty: Specialty = this.specialtyForm.value();

    const operation$ = isEdit ? this.specialtyService.update(id, specialty) : this.specialtyService.save(specialty);

    operation$.subscribe(() => {
      this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
      this.dialogRef.close(true);
    });
  }

  cancel(){
    this.dialogRef.close(false);
  }
}
