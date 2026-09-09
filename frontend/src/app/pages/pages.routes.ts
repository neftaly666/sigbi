import { Routes } from "@angular/router";
import { certGuard } from "../guard/cert.guard";
import { ExamComponent } from "./exam/exam.component";
import { ExamEditComponent } from "./exam/exam-edit/exam-edit.component";
import { SpecialtyComponent } from "./specialty/specialty.component";
import { PatientComponent } from "./patient/patient.component";
import { MedicComponent } from "./medic/medic.component";
import { ConsultWizardComponent } from "./consult-wizard/consult-wizard.component";
import { ConsultWizardAiComponent } from "./consult-wizard/consult-wizard-ai.component";
import { SearchComponent } from "./search/search.component";
import { ReportComponent } from "./report/report.component";
import { DrugRagComponent } from "./drug-rag/drug-rag.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Not403Component } from "./not-403/not-403.component";

export const pagesRoutes: Routes = [     
    { path: 'dashboard', component: DashboardComponent, canActivate: [certGuard] },
    { path: 'exam', component: ExamComponent, canActivate: [certGuard], children: [
        { path: 'new', component: ExamEditComponent },
        { path: 'edit/:id', component: ExamEditComponent }
    ]},
    { path: 'specialty', component: SpecialtyComponent, canActivate: [certGuard] },
    { path: 'patient', component: PatientComponent, canActivate: [certGuard] },
    { path: 'medic', component: MedicComponent, canActivate: [certGuard] },
    { path: 'consult-wizard', component: ConsultWizardComponent, canActivate: [certGuard] },
    { path: 'consult-wizard-ai', component: ConsultWizardAiComponent, canActivate: [certGuard] },
    { path: 'search', component: SearchComponent, canActivate: [certGuard] },
    { path: 'report', component: ReportComponent, canActivate: [certGuard] },
    { path: 'drug-rag', component: DrugRagComponent, canActivate: [certGuard] },
    { path: 'not-403', component: Not403Component}

]
