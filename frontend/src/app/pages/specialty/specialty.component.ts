import { Component, effect, inject, viewChild } from '@angular/core';
import { Specialty } from '../../model/specialty';
import { SpecialtyStore } from '../../store/specialty.store';
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
import { SpecialtyDialogComponent } from './specialty-dialog/specialty-dialog.component';
import { SpecialtyService } from '../../services/specialty.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-specialty',
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
  templateUrl: './specialty.component.html',
  styleUrl: './specialty.component.css',
  providers: [SpecialtyStore]
})
export class SpecialtyComponent {

  private readonly specialtyStore = inject(SpecialtyStore);
  private readonly specialtyService = inject(SpecialtyService);
  private readonly dialog = inject(MatDialog);

  protected readonly dataSource = new MatTableDataSource<Specialty>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  protected $specialties = this.specialtyStore.$specialties;

  protected displayedColumns: string[] = ['idSpecialty', 'nameSpecialty', 'descriptionSpecialty', 'actions'];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$specialties();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
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

  openDialog(idSpecialty?: number){
    this.dialog
    .open(SpecialtyDialogComponent, { width: '400px', data: idSpecialty ?? null })
    .afterClosed()
    .pipe(filter((saved) => saved))
    .subscribe(() => this.specialtyStore.reload());
  }

  delete(idSpecialty: number){
    this.dialog
    .open(ConfirmDialogComponent)
    .afterClosed()
    .pipe(
      filter((confirmed) => confirmed),
      switchMap(() => this.specialtyService.delete(idSpecialty)),
      tap(() => this.notificationService.notify('DELETED'))
    )
    .subscribe(() => this.specialtyStore.reload());
  }

}
