import { Routes } from "@angular/router";
import { BookComponent } from "./book/book.component";
import { CategoryComponent } from "./category/category.component";
import { AssistantComponent } from "./assistant/assistant.component";
import { ClientComponent } from "./client/client.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { ReservationWizardComponent } from "./reservation-wizard/reservation-wizard.component";

/**
 * Las seis pantallas de AN050 sección 3.3, más el asistente de reserva, que no tiene
 * entrada propia en el menú: se llega desde el botón "Nueva reserva".
 *
 * Ninguna lleva guard. certGuard consulta /v1/menus/user, que es la tabla `menú` heredada
 * de MediApp y sin token devuelve una lista vacía, así que cerraria las seis. RF-18 es
 * prioridad C; cuando entre, el permiso se resuelve sobre esta lista de destinos.
 */
export const pagesRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'book', component: BookComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'client', component: ClientComponent },
    { path: 'reservation', component: ReservationComponent },
    { path: 'reservation-wizard', component: ReservationWizardComponent },
    { path: 'assistant', component: AssistantComponent },

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
]
