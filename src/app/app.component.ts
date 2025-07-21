import { Component, OnInit } from '@angular/core';
import { Produit } from './models/produit';
import { ProduitService } from './services/produit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // template: `
  //   <div class="container mt-4">
  //     <app-produit *ngFor="let produit of produits" [produit]="produit"></app-produit>
  //   </div>
  // `
})
export class AppComponent implements OnInit{

  constructor(private produitService: ProduitService){}

  produits: Produit[] = [];

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(){
    this.produitService.getProduits().subscribe(
      (data) => {
        this.produits = data
      }
    );
  }

  title = 'l3_gl';
}
