import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from '../../../models/categorie';
import { Produit } from '../../../models/produit';
import { error } from 'console';
import { CategorieService } from '../../../services/categorie.service';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrl: './produit-form.component.css'
})
export class ProduitFormComponent implements OnInit{

  constructor(
    private produitService: ProduitService,    
    private categorieService: CategorieService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute : ActivatedRoute
  ){}

  produitForm!: FormGroup;
  id!: number;
  isEditMode: boolean = false;

  categories: Categorie[]=[];

  ngOnInit(): void {
    this.init();
  }


  init(){

    this.produitForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      prix: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      categorie_id: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });

    this.loadCategories();

    this.activatedRoute.paramMap.subscribe( 
      params => {
        const paramId = params.get('id');
        if (paramId) {
          this.id = +paramId;
          this.isEditMode = true;

          this.produitService.getProductById(this.id).subscribe(
            data => {
              this.produitForm.patchValue(data)
          });

        }
      }
    )
  }

 onSubmit(): void {
  
    if (this.produitForm.invalid) return;
    const produitData: Produit = this.produitForm.value;

    if (this.isEditMode && this.id) {
      
      this.produitService.updateProduct(this.id, produitData).subscribe(() => {
          this.router.navigate(['/produits']);
        },
        error=>{
          console.log("Erreur "+ error);
        }
      );
    } else {
      this.produitService.addProduct(produitData).subscribe(() => {
        this.router.navigate(['/produits']);
      });
    }
  }


  loadCategories(){
    this.categorieService.getCategories().subscribe(
      (values) => {
        this.categories = values;
      }
    )
  }

}
