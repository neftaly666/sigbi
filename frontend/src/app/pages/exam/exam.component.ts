import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { Exam } from '../../model/exam';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamStore } from '../../store/exam.store';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, startWith, switchMap, tap } from 'rxjs';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ExamService } from '../../services/exam.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-exam',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
  providers: [ExamStore]
})
export class ExamComponent {
  
  private readonly examStore = inject(ExamStore);
  private readonly router = inject(Router);
  private readonly examService = inject(ExamService);
  private readonly dialog = inject(MatDialog);

  protected readonly dataSource = new MatTableDataSource<Exam>();
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort); 
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  //protected $exams = signal<Exam[]>([]);  
  //protected $exams = toSignal(this.examService.findAll(), { initialValue: [] });
  protected $exams = this.examStore.$exams;
  private readonly $url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
  );

  protected displayedColumns: string[] = ['idExam', 'nameExam', 'descriptionExam', 'actions'];

  /*ngOnInit() {
    //this.examService.findAll().subscribe(data => $exams.set(data));
    //this.examService.findAll().subscribe(data => new MatTableDataSource<Exam>(data));
  }*/

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }
  
  private setupTableEffect() {
    effect(() => {
      const data = this.$exams();
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

  /*private readonly tableEffect = effect(() => {
      const data = this.$exams();

      this.dataSource.data = data;
  });*/
  

  applyFilter(e: any){
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected readonly hasChildActive = computed(() =>
    this.$url().startsWith('/pages/exam/new') || this.$url().startsWith('/pages/exam/edit/')
  );

  delete(idExam: number){
    this.dialog
    .open(ConfirmDialogComponent)
    .afterClosed()
    .pipe(
      filter((confirmed) => confirmed),
      switchMap(() => this.examService.delete(idExam)),
      tap(() => this.notificationService.notify('DELETED'))
    )
    .subscribe(() => this.examStore.reload());

    /*this.dialog.open(ConfirmDialogComponent)
    .afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.examService.delete(idExam).subscribe(() => this.examStore.reload());
    });*/
  }

}
