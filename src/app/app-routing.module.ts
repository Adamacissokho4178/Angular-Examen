import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorieComponent } from './component/categorie/categorie.component';
import { AjoutCategorieComponent } from './component/categorie/ajout-categorie/ajout-categorie.component';
import { ProduitComponent } from './component/produit/produit.component';
import { ProduitFormComponent } from './component/produit/produit-form/produit-form.component';

const routes: Routes = [
  { path: '', component: CategorieComponent},
  { path: 'categories', component: CategorieComponent},
  { path: 'categories/ajout', component: AjoutCategorieComponent },
  { path: 'categories/edit/:id', component: AjoutCategorieComponent },

  { path: 'produits', component: ProduitComponent},
  { path: 'produits/ajout', component: ProduitFormComponent},
  { path: 'produits/edit/:id', component: ProduitFormComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
