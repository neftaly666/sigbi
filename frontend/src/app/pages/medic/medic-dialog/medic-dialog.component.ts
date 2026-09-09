import { Component, inject, signal } from '@angular/core';
import { Medic } from '../../../model/medic';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormRoot, FormField } from "@angular/forms/signals";
import { MedicForm } from '../../../forms/medic.form';
import {MatSelectModule} from '@angular/material/select';
import { MedicDialogStore } from '../../../store/medic-dialog.store';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MedicService } from '../../../services/medic.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-medic-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormRoot,
    FormField
],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css',
  providers: [MedicDialogStore, MedicForm]
})
export class MedicDialogComponent {

  private readonly data = inject<Medic>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MedicDialogComponent>);
  protected readonly medicForm = inject(MedicForm);
  private readonly medicDialogStore = inject(MedicDialogStore);
  private readonly medicService = inject(MedicService);
  private readonly notificationService = inject(NotificationService);

  protected $specialties = this.medicDialogStore.$specialties;

  protected readonly $file = signal<File | null>(null);
  protected readonly $preview = signal<string | null>(null);

  constructor() {
    this.medicForm.patch(this.data);
    this.$preview.set(this.data?.photo || null);
  }

  close(result: boolean = false) {
    this.dialogRef.close(result);
  }

  changeFile(e: Event){
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;

    this.$file.set(file);
    this.$preview.set(file ? URL.createObjectURL(file) : this.data?.photo || null);
  }

  operate(){
    if(this.medicForm.isInvalid()) return;

    const medic: Medic = this.medicForm.value();
    const file = this.$file() ?? undefined;
    const isEdit = this.medicForm.isEdit();
    const msg = isEdit ? 'UPDATED' : 'CREATED';
    const operation$ = isEdit ? this.medicService.update(medic.idMedic, medic, file) : this.medicService.save(medic, file);

    operation$.subscribe(()=> {
      this.notificationService.notify(msg);
      this.close(true);
    });
  }
}
