import { Component, input } from '@angular/core';

/**
 * Cabecera de AN050 sección 3.2: 80 px de alto, título en Lora 28/36 y, opcionalmente, un
 * subtítulo que dice donde está el usuario dentro del flujo.
 *
 * Vive en la plantilla de cada pantalla y no en el layout porque las acciones son
 * propias de la pantalla: como mucho dos, y se proyectan con <ng-content>.
 * No lleva buscador global: cada pantalla filtra lo suyo en su barra de filtros.
 */
@Component({
  selector: 'app-page-header',
  template: `
    <header class="topbar">
      <div class="topbar__titles">
        <h1 class="topbar__title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="topbar__subtitle">{{ subtitle() }}</p>
        }
      </div>

      <div class="topbar__actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: `
    .topbar {
      display: flex;
      align-items: center;
      gap: var(--sigbi-space-4);
      min-height: var(--sigbi-topbar-height);
      padding: 20px var(--sigbi-space-6);
      background: var(--mat-sys-surface);
    }

    .topbar__titles {
      flex: 1 1 auto;
      min-width: 0;
    }

    .topbar__title {
      font: var(--mat-sys-headline-medium);
      color: var(--mat-sys-on-surface);
      margin: 0;
    }

    .topbar__subtitle {
      font-family: var(--mat-sys-body-medium-font);
      font-size: 13px;
      line-height: 18px;
      color: var(--mat-sys-on-surface-variant);
      margin: 2px 0 0;
    }

    .topbar__actions {
      display: flex;
      align-items: center;
      gap: var(--sigbi-space-3);
      flex-shrink: 0;
    }

    /* Por debajo de 1024 px el título se compacta a 24/30 y la acción principal pasa a
       boton flotante dentro de la pantalla (AN050 seccion 3.5) */
    @media (max-width: 1023px) {
      .topbar {
        padding: var(--sigbi-space-3) var(--sigbi-space-4);
        min-height: 56px;
      }

      .topbar__title {
        font-size: 24px;
        line-height: 30px;
      }
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
