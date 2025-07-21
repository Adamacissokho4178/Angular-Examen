import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/categorie';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export class CategorieComponent implements OnInit{

  constructor(
    private categorieService: CategorieService,
    private router: Router
  ){}

  categories : Categorie[] = [];


  ngOnInit(): void {
    this.listCategories();
  }

  listCategories(){
    this.categorieService.getCategories().subscribe(
      (data) => {
        this.categories = data
      });
  }


  deleteCategorie(id: number){
    this.categorieService.deleteCategorie(id).subscribe(
      () =>{
        this.router.navigate(['/categories']);
      }
    );
  }


}
