import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { marked } from 'marked';
import { DrugRagStore } from '../../store/drug-rag.store';

//Los cuatro aparecen en farmacologia.pdf. Metformina y Omeprazol no, y el primer clic
//devolveria "no encuentro esa informacion": la pantalla se leeria como rota de entrada
const EXAMPLES = ['Aspirina', 'Amoxicilina', 'Morfina', 'Digoxina'];

const TERM_MAX_LENGTH = 80;

@Component({
  selector: 'app-drug-rag',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './drug-rag.component.html',
  styleUrl: './drug-rag.component.css',
  providers: [DrugRagStore]
})
export class DrugRagComponent {

  protected readonly drugRagStore = inject(DrugRagStore);

  protected readonly $term = this.drugRagStore.$term;
  protected readonly $loading = this.drugRagStore.$loading;
  protected readonly $error = this.drugRagStore.$error;
  protected readonly $history = this.drugRagStore.$history;
  protected readonly $hasResult = this.drugRagStore.$hasResult;
  protected readonly $isIdle = this.drugRagStore.$isIdle;

  protected readonly examples = EXAMPLES;
  protected readonly maxLength = TERM_MAX_LENGTH;

  protected readonly $text = signal('');

  //El Markdown se convierte una sola vez por respuesta y se enlaza con [innerHTML]
  protected readonly $html = computed(() => DrugRagComponent.render(this.drugRagStore.$answer()));

  protected changeText(e: Event) {
    this.$text.set((e.target as HTMLInputElement).value);
  }

  protected search() {
    const text = this.$text();

    if (!text.trim() || this.$loading()) return;

    this.drugRagStore.search(text);
  }

  //Llena el campo y consulta: los chips de ejemplo y los del historial hacen lo mismo
  protected use(term: string) {
    if (this.$loading()) return;

    this.$text.set(term);
    this.drugRagStore.search(term);
  }

  protected retry() {
    this.drugRagStore.retry();
  }

  protected clear() {
    this.drugRagStore.clear();
    this.$text.set('');
  }

  //marked no pone target en los enlaces, sin esto un link se lleva la aplicacion
  private static render(text: string): string {
    if (!text) return '';

    return marked
      .parse(text, { async: false })
      .replace(/<a /g, '<a target="_blank" rel="noopener" ');
  }
}
