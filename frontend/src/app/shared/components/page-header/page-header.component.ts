import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SessionStore } from '../../../store/session.store';

/**
 * Cabecera de AN050 sección 3.2: 80 px de alto, título en Lora 28/36 y, opcionalmente, un
 * subtítulo que dice donde está el usuario dentro del flujo.
 *
 * Vive en la plantilla de cada pantalla y no en el layout porque las acciones son
 * propias de la pantalla: como mucho dos, y se proyectan con <ng-content>.
 * No lleva buscador global: cada pantalla filtra lo suyo en su barra de filtros.
 *
 * Lleva ademas el **avatar de cuenta**, y ese si es de todas las pantallas: por debajo de
 * 1024 px el menu lateral desaparece y con el la fila de usuario y el unico boton de
 * cerrar sesion, asi que en un telefono no habia forma de salir ni de saber con que cuenta
 * se habia entrado (DV-38 de AN090). Por encima de 1024 px el avatar se oculta: alli el
 * pie del menu ya hace ese trabajo y tenerlo dos veces seria ruido.
 */
@Component({
  selector: 'app-page-header',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
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

        <button
          class="topbar__cuenta"
          mat-icon-button
          type="button"
          [matMenuTriggerFor]="menuCuenta"
          aria-label="Cuenta y cerrar sesión"
        >
          <mat-icon>person</mat-icon>
        </button>

        <mat-menu #menuCuenta="matMenu">
          <!-- Aqui si cabe el correo entero: el menu no esta atado a los 248 px del lateral -->
          <div class="cuenta-menu__correo">{{ $correo() || 'Sin sesión' }}</div>
          <button mat-menu-item type="button" (click)="salir()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar sesión</span>
          </button>
        </mat-menu>
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

    /* El avatar solo existe en la variante estrecha: en ancho, el pie del menu lateral ya
       muestra la cuenta y ofrece la salida (AN050 seccion 3.5) */
    .topbar__cuenta {
      display: none;
    }

    .cuenta-menu__correo {
      padding: var(--sigbi-space-3) var(--sigbi-space-4);
      font-family: var(--mat-sys-body-medium-font);
      font-size: 13px;
      line-height: 18px;
      color: var(--mat-sys-on-surface-variant);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    /* Por debajo de 1024 px el título se compacta a 24/30 y la acción principal pasa a
       boton flotante dentro de la pantalla (AN050 seccion 3.5) */
    @media (max-width: 1023px) {
      .topbar__cuenta {
        display: inline-flex;
      }

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
  private readonly sessionStore = inject(SessionStore);

  readonly title = input.required<string>();
  readonly subtitle = input<string>('');

  protected readonly $correo = this.sessionStore.$correo;

  protected salir() {
    this.sessionStore.salir();
  }
}
