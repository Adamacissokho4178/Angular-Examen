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
import { DashboardEnseignantComponent } from './component/dashboard-enseignant/dashboard-enseignant.component';
import { DashboardEleveParentComponent } from './component/dashboard-eleve-parent/dashboard-eleve-parent.component';

const routes: Routes = [
  { path: '', component: AccueilComponent},
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
  { path: 'dashboard-enseignant', component: DashboardEnseignantComponent },
  { path: 'dashboard-eleve-parent', component: DashboardEleveParentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
