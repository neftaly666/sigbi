import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Menu } from '../../model/menu';
import { LoginService } from '../../services/login.service';
import { MenuService } from '../../services/menu.service';
import { MediBotAgentComponent } from '../../shared/components/medibot-agent/medibot-agent.component';

@Component({
  selector: 'app-layout',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    MediBotAgentComponent
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

  private readonly menuService = inject(MenuService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  //Se carga una sola vez, al construir el layout
  protected $menus = toSignal(this.menuService.getMenusByUser(), { initialValue: [] as Menu[] });

  //La navegacion no espera la respuesta: la cookie ya se esta invalidando en el servidor
  logout(){
    this.loginService.logout().subscribe();

    this.router.navigate(['/login']);
  }
}
