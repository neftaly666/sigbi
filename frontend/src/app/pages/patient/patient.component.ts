import { Component, effect, inject, viewChild } from '@angular/core';
import { Patient } from '../../model/patient';
import { PatientStore } from '../../store/patient.store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PatientDialogComponent } from './patient-dialog/patient-dialog.component';
import { PatientService } from '../../services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-patient',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
  providers: [PatientStore]
})
export class PatientComponent {

  private readonly patientStore = inject(PatientStore);
  private readonly patientService = inject(PatientService);
  private readonly dialog = inject(MatDialog);

  protected readonly dataSource = new MatTableDataSource<Patient>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  protected $patients = this.patientStore.$patients;
  protected $pageRequest = this.patientStore.$pageRequest;  
  protected $totalElements = this.patientStore.$totalElements;

  //address no se lista: 150 caracteres no entran en una fila, se edita en el dialogo
  protected displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni', 'phone', 'email', 'actions'];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$patients();
      //const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      //this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });
  }

  private setupNotificationEffect(){
    effect(() => {
      const message = this.notificationService.$message();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
        //limpio para que se muestre el mensaje, sino el signals se queda pegado y no reaccione si no cambia el valor
        this.notificationService.clear();
      }
    });
  }

  applyFilter(e: any){
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(idPatient?: number){
    this.dialog
    .open(PatientDialogComponent, { width: '400px', data: idPatient ?? null, disableClose: true })
    .afterClosed()
    .pipe(filter((saved) => saved))
    .subscribe(() => this.patientStore.reload());
  }

  delete(idPatient: number){
    this.dialog
    .open(ConfirmDialogComponent)
    .afterClosed()
    .pipe(
      filter((confirmed) => confirmed),
      switchMap(() => this.patientService.delete(idPatient)),
      tap(() => this.notificationService.notify('DELETED'))
    )
    .subscribe(() => this.patientStore.reload());
  }

  changePage(e: any){
    this.patientStore.change(e.pageIndex, e.pageSize);
  }

}
