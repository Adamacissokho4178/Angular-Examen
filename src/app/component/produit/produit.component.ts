import { Component, Input, OnInit } from '@angular/core';
import { Produit } from '../../models/produit';
import { ProduitService } from '../../services/produit.service';
import { error } from 'console';

@Component({
  selector: 'app-produit',
  styleUrl: './produit.component.css',
  templateUrl: './produit.component.html',
})
export class ProduitComponent implements OnInit{

  constructor(private produistService: ProduitService){}

  produits: Produit[] = [];

  errorMessage = "";

  successMessage= "";
  ngOnInit(): void {
    this.getAllsProducts();
  }


  getAllsProducts(){
    this.produistService.getProduits().subscribe(
      (data) => {
        this.produits = data
      },
      (error)=>{
        console.log("Erreur " + error);
        this.errorMessage = error
      }
    )

  }


  delete(id: number){
    this.produistService.deletProduct(id)
  }


}
