import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntrepriseComponent } from './entreprise/entreprise/entreprise.component';
import { ProduitComponent } from './component/produit/produit.component';
import { CategorieComponent } from './component/categorie/categorie.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { provideHttpClient } from '@angular/common/http';
import { AjoutCategorieComponent } from './component/categorie/ajout-categorie/ajout-categorie.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProduitFormComponent } from './component/produit/produit-form/produit-form.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { AproposComponent } from './component/apropos/apropos.component';
import { ContactComponent } from './component/contact/contact.component';
import { DashboardAdminComponent } from './component/dashboard-admin/dashboard-admin.component';
import { DashboardEnseignantComponent } from './component/dashboard-enseignant/dashboard-enseignant.component';
import { DashboardEleveParentComponent } from './component/dashboard-eleve-parent/dashboard-eleve-parent.component';
import { EleveFormComponent } from './component/eleve-form/eleve-form.component';
import { HttpClientModule } from '@angular/common/http';
import { AffectationFormComponent } from './component/affectation-form/affectation-form.component';

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
    DashboardEnseignantComponent,
    DashboardEleveParentComponent,
    EleveFormComponent,
    AffectationFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
