import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStore } from '../../store/dashboard.store';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatIconModule
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [ DashboardStore ]
})
export class DashboardComponent {

  private readonly dashboardStore = inject(DashboardStore);

  //Viene de GET /auth/user, que devuelve el email del token
  protected $userInfo = this.dashboardStore.$username;
}
