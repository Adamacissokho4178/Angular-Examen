import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntrepriseComponent } from './entreprise/entreprise/entreprise.component';
import { ProduitComponent } from './component/produit/produit.component';
import { CategorieComponent } from './component/categorie/categorie.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AjoutCategorieComponent } from './component/categorie/ajout-categorie/ajout-categorie.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProduitFormComponent } from './component/produit/produit-form/produit-form.component';
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

// Composant de notification
import { NotificationComponent } from './component/notification/notification.component';

// Composant Dashboard
import { DashboardComponent } from './component/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    EntrepriseComponent,
    ProduitComponent,
    CategorieComponent,
    AccueilComponent,
    AjoutCategorieComponent,
    ProduitFormComponent,
    RegisterComponent,
    LoginComponent,
    AproposComponent,
    ContactComponent,
    DashboardAdminComponent,

    DashboardEleveParentComponent,
    AjoutEleveComponent,
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
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
