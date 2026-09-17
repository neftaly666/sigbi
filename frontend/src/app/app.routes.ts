import { Routes } from '@angular/router';
import { environment } from '../environments/environment.development';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { Not403Component } from './pages/not-403/not-403.component';
import { Not404Component } from './pages/not-404/not-404.component';

export const routes: Routes = [
    /*
     * AN050 sección 3.1: con la seguridad desactivada la aplicación entra directamente al
     * panel, y la pantalla de acceso queda como diseño no implementado, no como
     * funcionalidad rota. Con RF-18 activo vuelve a pedir acceso.
     */
    { path: '', redirectTo: environment.AUTH_ENABLED ? 'login' : 'pages/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { 
        path: 'pages',
        component: LayoutComponent,
        loadChildren: () => import('./pages/pages.routes').then(m => m.pagesRoutes)
    },
    /*
     * Las dos páginas de error van fuera del shell (AN060 sección 2): quien no tiene
     * permiso, o se equivoco de dirección, no debería ver el menú de navegación de una
     * aplicación en la que no esta.
     */
    { path: '403', component: Not403Component },
    {
        path: '**', component: Not404Component
    }
];
