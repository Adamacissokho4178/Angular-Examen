import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../../../services/categorie.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from '../../../models/categorie';

@Component({
  selector: 'app-ajout-categorie',
  templateUrl: './ajout-categorie.component.html',
  styleUrl: './ajout-categorie.component.css'
})
export class AjoutCategorieComponent implements OnInit{

  constructor(
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ){}

  categorieForm!: FormGroup;
  id?: number;
  isEditMode: boolean = false;


  ngOnInit(): void {
    this.categorieForm = this.fb.group({
      nom: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        this.id = +paramId;
        this.isEditMode = true;

        this.categorieService.getCategorieById(this.id).subscribe(data => {
          this.categorieForm.patchValue(data);
        });
      }
    });
    
  }


  onSubmit(): void {
    if (this.categorieForm.invalid) return;

    const categorieData: Categorie = this.categorieForm.value;

    if (this.isEditMode && this.id) {
      this.categorieService.editCategorie(this.id, categorieData).subscribe(() => {
        this.router.navigate(['/categories']);
      });
    } else {
      this.categorieService.addCategorie(categorieData).subscribe(() => {
        this.router.navigate(['/categories']);
      });
    }
  }


}
