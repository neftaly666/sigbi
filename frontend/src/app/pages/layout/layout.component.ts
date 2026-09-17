import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { SessionStore } from '../../store/session.store';

interface Destino {
  etiqueta: string;
  icono: string;
  ruta: string;
  //AN050 sección 3.5: la barra inferior lleva cinco destinos, no seis. Categorías es el
  //mantenimiento menos frecuente y se relega al menú de la pantalla de Libros.
  enMovil: boolean;
}

/**
 * App shell de AN050 sección 3: menú lateral fijo de 248 px y columna de contenido.
 *
 * Los seis destinos son estaticos y no salen de la tabla `menú` del backend: esa tabla
 * es de MediApp y AN050 sección 3.3 fija estos seis con su icono y su ruta. Cuando RF-18
 * entre en juego, el filtrado por rol se hace sobre esta lista.
 */
@Component({
  selector: 'app-layout',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

  private readonly sessionStore = inject(SessionStore);
  private readonly router = inject(Router);

  protected readonly $cuenta = this.sessionStore.$cuenta;
  protected readonly $correo = this.sessionStore.$correo;

  protected readonly destinos: Destino[] = [
    { etiqueta: 'Panel', icono: 'dashboard', ruta: '/pages/dashboard', enMovil: true },
    { etiqueta: 'Libros', icono: 'menu_book', ruta: '/pages/book', enMovil: true },
    { etiqueta: 'Categorías', icono: 'sell', ruta: '/pages/category', enMovil: false },
    { etiqueta: 'Clientes', icono: 'group', ruta: '/pages/client', enMovil: true },
    { etiqueta: 'Reservas', icono: 'event', ruta: '/pages/reservation', enMovil: true },
    { etiqueta: 'Asistente', icono: 'auto_awesome', ruta: '/pages/assistant', enMovil: true },
  ];

  protected readonly destinosMoviles = this.destinos.filter((d) => d.enMovil);

  //El estado activo se calcula sobre la url en vez de con routerLinkActive porque
  //reservation-wizard no tiene entrada propia: mientras dura el asistente de reserva el
  //destino activo sigue siendo Reservas (AN050 sección 3.3)
  private readonly $url = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly $activo = computed(() => {
    const url = this.$url();

    if (url.startsWith('/pages/reservation')) return '/pages/reservation';

    return this.destinos.find((d) => url.startsWith(d.ruta))?.ruta ?? '';
  });

  //Cerrar sesión vive en el store: lo hacen dos sitios -este pie y el avatar de la
  //cabecera, que es la unica salida en un telefono- y no puede divergir entre los dos
  salir() {
    this.sessionStore.salir();
  }
}
