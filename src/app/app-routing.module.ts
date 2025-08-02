import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorieComponent } from './component/categorie/categorie.component';
import { AjoutCategorieComponent } from './component/categorie/ajout-categorie/ajout-categorie.component';
import { ProduitComponent } from './component/produit/produit.component';
import { ProduitFormComponent } from './component/produit/produit-form/produit-form.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { AproposComponent } from './component/apropos/apropos.component';
import { ContactComponent } from './component/contact/contact.component';
import { DashboardAdminComponent } from './component/dashboard-admin/dashboard-admin.component';

import { DashboardEleveParentComponent } from './component/dashboard-eleve-parent/dashboard-eleve-parent.component';
import { AjoutEleveComponent } from './component/ajout-eleve/ajout-eleve.component';

// Imports des nouveaux composants CRUD
import { EnseignantListComponent } from './component/enseignant/enseignant-list.component';
import { EnseignantFormComponent } from './component/enseignant/enseignant-form.component';
import { MatiereListComponent } from './component/matiere/matiere-list.component';
import { MatiereFormComponent } from './component/matiere/matiere-form.component';
import { NoteListComponent } from './component/note/note-list.component';
import { NoteFormComponent } from './component/note/note-form.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: AccueilComponent},
  
  // Routes existantes
  { path: 'categories', component: CategorieComponent},
  { path: 'categories/ajout', component: AjoutCategorieComponent },
  { path: 'categories/edit/:id', component: AjoutCategorieComponent },

  { path: 'produits', component: ProduitComponent},
  { path: 'produits/ajout', component: ProduitFormComponent},
  { path: 'produits/edit/:id', component: ProduitFormComponent},
  
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'apropos', component: AproposComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },

  { path: 'dashboard-eleve-parent', component: DashboardEleveParentComponent },
  { path: 'ajout-eleve', component: AjoutEleveComponent },

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
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
