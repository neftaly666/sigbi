import { Component, effect, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Medic } from '../../model/medic';
import { MedicStore } from '../../store/medic.store';
import { MatDialog } from '@angular/material/dialog';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap, tap } from 'rxjs';
import { MedicService } from '../../services/medic.service';

@Component({
  selector: 'app-medic',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css',
  providers: [MedicStore]
})
export class MedicComponent {

  private readonly medicStore = inject(MedicStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);
  private readonly medicService = inject(MedicService);

  protected readonly defaultPhoto = '/default-photo.svg';

  protected dataSource = new MatTableDataSource<Medic>();
  protected displayedColumns: string[] = ['idMedic', 'photo', 'primaryName', 'actions'];
  protected $medics = this.medicStore.$medics;

  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  

  constructor() {
    this.initializeEffects();
  }

  private initializeEffects() {
    effect(()=> {
      const data = this.$medics();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });

    effect(()=> {
      const message = this.notificationService.$message();
      if(message){
        this.snackBar.open(message, 'INFO', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.notificationService.clear();
      }
    });
  }

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  openDialog(medic?: Medic){
    this.dialog.open(MedicDialogComponent, {
      width: '650px',
      data: medic
    })
    .afterClosed()
    .subscribe((result: boolean) => {
      if(result) this.medicStore.reload();
    });
  }

  delete(idMedic: number){
    this.dialog
    .open(ConfirmDialogComponent)
    .afterClosed()
    .pipe(
      filter((result: boolean) => result),
      switchMap(() => this.medicService.delete(idMedic)),
      tap(() => this.notificationService.notify('DELETED'))
    )
    .subscribe(() => this.medicStore.reload());
  }
}
