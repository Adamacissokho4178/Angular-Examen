import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntrepriseComponent } from './entreprise/entreprise/entreprise.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { AproposComponent } from './component/apropos/apropos.component';
import { ContactComponent } from './component/contact/contact.component';
import { DashboardAdminComponent } from './component/dashboard-admin/dashboard-admin.component';

import { DashboardEleveParentComponent } from './component/dashboard-eleve-parent/dashboard-eleve-parent.component';

// Imports des nouveaux composants CRUD
import { EnseignantListComponent } from './component/enseignant/enseignant-list.component';
import { EnseignantFormComponent } from './component/enseignant/enseignant-form.component';
import { MatiereListComponent } from './component/matiere/matiere-list.component';
import { MatiereFormComponent } from './component/matiere/matiere-form.component';
import { NoteListComponent } from './component/note/note-list.component';
import { NoteFormComponent } from './component/note/note-form.component';

// Composant de notification
import { NotificationComponent } from './component/notification/notification.component';

// Composant Dashboard
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ClasseListComponent } from './component/classe/classe-list/classe-list.component';
import { ClasseFormComponent } from './component/classe/classe-form/classe-form.component';
import { AffectationComponent } from './component/affectation/affectation.component';

// Composants Suivi des Notes
import { SuiviNotesComponent } from './component/suivi-notes/suivi-notes.component';
import { SuiviNotesDetailsComponent } from './component/suivi-notes-details/suivi-notes-details.component';

// Composant Dashboard Enseignant
import { DashboardEnseignantComponent } from './component/dashboard-enseignant/dashboard-enseignant.component';

@NgModule({
  declarations: [
    AppComponent,
    EntrepriseComponent,
    AccueilComponent,
    RegisterComponent,
    LoginComponent,
    AproposComponent,
    ContactComponent,
    DashboardAdminComponent,

    DashboardEleveParentComponent,
    // Nouveaux composants CRUD
    EnseignantListComponent,
    EnseignantFormComponent,
    MatiereListComponent,
    MatiereFormComponent,
    NoteListComponent,
    NoteFormComponent,
    // Composant de notification
    NotificationComponent,
    // Composant Dashboard
    DashboardComponent,
    ClasseListComponent,
    ClasseFormComponent,
    AffectationComponent,
    // Composants Suivi des Notes
    SuiviNotesComponent,
    SuiviNotesDetailsComponent,
    // Composant Dashboard Enseignant
    DashboardEnseignantComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
