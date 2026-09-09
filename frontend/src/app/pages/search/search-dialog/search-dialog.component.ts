import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Consult } from '../../../model/consult';
import { SearchDialogStore } from '../../../store/search-dialog.store';

@Component({
  selector: 'app-search-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css',
  providers: [SearchDialogStore]
})
export class SearchDialogComponent {

  protected readonly consult = inject<Consult>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SearchDialogComponent>);
  private readonly searchDialogStore = inject(SearchDialogStore);

  //Los examenes no viajan en ConsultDTO, se piden aparte y solo cuando se abre el dialogo
  protected $exams = this.searchDialogStore.$exams;

  constructor() {
    this.searchDialogStore.setIdConsult(this.consult?.idConsult ?? null);
  }

  close(){
    this.dialogRef.close();
  }
}
