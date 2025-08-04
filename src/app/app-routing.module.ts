import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './component/accueil/accueil.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { AproposComponent } from './component/apropos/apropos.component';
import { ContactComponent } from './component/contact/contact.component';
import { DashboardAdminComponent } from './component/dashboard-admin/dashboard-admin.component';
import { DashboardEnseignantComponent } from './component/dashboard-enseignant/dashboard-enseignant.component';

import { DashboardEleveParentComponent } from './component/dashboard-eleve-parent/dashboard-eleve-parent.component';

// Imports des nouveaux composants CRUD
import { EnseignantListComponent } from './component/enseignant/enseignant-list.component';
import { EnseignantFormComponent } from './component/enseignant/enseignant-form.component';
import { MatiereListComponent } from './component/matiere/matiere-list.component';
import { MatiereFormComponent } from './component/matiere/matiere-form.component';
import { NoteListComponent } from './component/note/note-list.component';
import { NoteFormComponent } from './component/note/note-form.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

// Imports des composants Classe
import { ClasseListComponent } from './component/classe/classe-list/classe-list.component';
import { ClasseFormComponent } from './component/classe/classe-form/classe-form.component';

// Import du composant Affectation
import { AffectationComponent } from './component/affectation/affectation.component';

// Imports des composants Suivi des Notes
import { SuiviNotesComponent } from './component/suivi-notes/suivi-notes.component';
import { SuiviNotesDetailsComponent } from './component/suivi-notes-details/suivi-notes-details.component';

const routes: Routes = [
  { path: '', component: AccueilComponent},
  
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'apropos', component: AproposComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'dashboard-enseignant', component: DashboardEnseignantComponent },

  { path: 'dashboard-eleve-parent', component: DashboardEleveParentComponent },

  // Nouvelles routes CRUD - Enseignant
  { path: 'enseignants', component: EnseignantListComponent },
  { path: 'enseignants/ajout', component: EnseignantFormComponent },
  { path: 'enseignants/edit/:id', component: EnseignantFormComponent },

  // Nouvelles routes CRUD - Matiere
  { path: 'matieres', component: MatiereListComponent },
  { path: 'matieres/ajout', component: MatiereFormComponent },
  { path: 'matieres/edit/:id', component: MatiereFormComponent },

  // Nouvelles routes CRUD - Note
  { path: 'notes', component: NoteListComponent },
  { path: 'notes/ajout', component: NoteFormComponent },
  { path: 'notes/edit/:id', component: NoteFormComponent },

  // Nouvelles routes CRUD - Classe
  { path: 'classes', component: ClasseListComponent },
  { path: 'classes/ajout', component: ClasseFormComponent },
  { path: 'classes/edit/:id', component: ClasseFormComponent },

  // Route pour les affectations (assignations)
  { path: 'affectations', component: AffectationComponent },

  // Routes pour le suivi des notes
  { path: 'suivi-notes', component: SuiviNotesComponent },
  { path: 'suivi-notes/details', component: SuiviNotesDetailsComponent },

  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
