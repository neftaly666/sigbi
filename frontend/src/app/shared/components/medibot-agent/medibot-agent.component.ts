import { afterRenderEffect, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { marked } from 'marked';
import { MediBotAgentStore } from '../../../store/medibot-agent.store';

//Una por tool, las del mock preguntan por el CRUD y el agente no tiene con que responderlas
const SUGGESTIONS = [
  '¿Qué médicos tienes registrados con el apellido Pérez?',
  'Busca el examen de sangre',
  '¿Qué consultas hubo entre el 01/08/2026 y el 15/08/2026?',
  '¿Qué puedes hacer por mí?'
];

@Component({
  selector: 'app-medibot-agent',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './medibot-agent.component.html',
  styleUrl: './medibot-agent.component.css'
})
export class MediBotAgentComponent {

  protected readonly medibotAgentStore = inject(MediBotAgentStore);

  protected readonly $open = this.medibotAgentStore.$open;
  protected readonly $loading = this.medibotAgentStore.$loading;
  protected readonly $showSuggestions = this.medibotAgentStore.$showSuggestions;

  protected readonly suggestions = SUGGESTIONS;
  protected readonly maxLength = 500;

  protected readonly $text = signal('');

  private readonly $list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly $input = viewChild<ElementRef<HTMLTextAreaElement>>('input');

  //El Markdown del agente se convierte una sola vez aqui y se enlaza con [innerHTML]
  protected readonly $view = computed(() =>
    this.medibotAgentStore.$messages().map((message) => ({
      ...message,
      html: message.role === 'bot' ? MediBotAgentComponent.render(message.text) : ''
    }))
  );

  constructor() {
    //Leen el DOM, tienen que correr despues del render que agrego el mensaje
    afterRenderEffect(() => {
      this.medibotAgentStore.$messages();
      this.$loading();

      const list = this.$list()?.nativeElement;

      if (list) list.scrollTop = list.scrollHeight;
    });

    afterRenderEffect(() => {
      if (!this.$open()) return;

      this.$input()?.nativeElement.focus();
    });
  }

  protected changeText(e: Event) {
    this.$text.set((e.target as HTMLTextAreaElement).value);
  }

  //Shift+Enter no necesita codigo, Angular arma el nombre del binding con los modificadores del evento
  protected enter(e: Event) {
    e.preventDefault();
    this.submit();
  }

  protected submit() {
    const text = this.$text();

    if (!text.trim() || this.$loading()) return;

    this.medibotAgentStore.send(text);
    this.$text.set('');
  }

  protected suggest(suggestion: string) {
    this.medibotAgentStore.send(suggestion);
  }

  protected retry() {
    this.medibotAgentStore.retry();
  }

  //Colapsa a la burbuja conservando la conversacion
  protected collapse() {
    this.medibotAgentStore.close();
  }

  //Cierra y olvida, la proxima apertura arranca desde el saludo con un id nuevo
  protected dismiss() {
    this.medibotAgentStore.close();
    this.medibotAgentStore.reset();
  }

  //marked no pone target en los enlaces, sin esto un link se lleva la aplicacion y la conversacion con ella
  private static render(text: string): string {
    return marked
      .parse(text, { async: false })
      .replace(/<a /g, '<a target="_blank" rel="noopener" ');
  }
}
