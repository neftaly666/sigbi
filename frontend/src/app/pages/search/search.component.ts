import { Component, effect, inject, viewChild } from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormField, FormRoot } from '@angular/forms/signals';
import { format } from 'date-fns';
import { SearchForm } from '../../forms/search.form';
import { SearchStore } from '../../store/search.store';
import { Consult } from '../../model/consult';
import { FilterConsultDTO } from '../../model/filter-consult-dto';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormRoot,
    FormField,
    DatePipe
],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  providers: [SearchForm, SearchStore]
})
export class SearchComponent {

  protected readonly searchForm = inject(SearchForm);
  private readonly searchStore = inject(SearchStore);
  private readonly dialog = inject(MatDialog);

  protected readonly dataSource = new MatTableDataSource<Consult>();
  protected displayedColumns: string[] = ['patient', 'medic', 'date', 'actions'];

  protected $consultData = this.searchStore.$consultData;
  protected $tabGroup = viewChild<MatTabGroup>('tabGroup');

  //yyyy-MM-dd + T + HH:mm:ss, una fecha pelada revienta el parse del backend
  private readonly DATE_PATTERN = "yyyy-MM-dd'T'HH:mm:ss";

  constructor() {
    this.setupTableEffect();
  }

  private setupTableEffect() {
    effect(() => {
      this.dataSource.data = this.$consultData();
    });
  }

  //El tab activo decide la busqueda, no hay modo combinado
  search(){
    const index = this.$tabGroup()?.selectedIndex ?? 0;

    if(index === 0){
      this.searchByOthers();
    }else{
      this.searchByDates();
    }
  }

  private searchByOthers(){
    const value = this.searchForm.value();
    //La query solo hace LOWER sobre la columna, las minusculas son responsabilidad del cliente
    const filter = new FilterConsultDTO(value.dni ?? '', (value.fullname ?? '').toLowerCase());

    this.searchStore.searchByOthers(filter);
  }

  private searchByDates(){
    const value = this.searchForm.value();
    if(!value.startDate || !value.endDate) return;

    this.searchStore.searchByDates(
      format(value.startDate, this.DATE_PATTERN),
      format(value.endDate, this.DATE_PATTERN)
    );
  }

  openDialog(consult: Consult){
    this.dialog.open(SearchDialogComponent, {
      width: '650px',
      data: consult
    });
  }
}
