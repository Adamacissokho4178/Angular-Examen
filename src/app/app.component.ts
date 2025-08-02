import { Component, OnInit } from '@angular/core';
import { Produit } from './models/produit';
import { ProduitService } from './services/produit.service';
import { AuthService } from './services/auth.service';

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

  constructor(
    private produitService: ProduitService,
    private authService: AuthService
  ){}

  produits: Produit[] = [];
  menuOpen = false;
  currentUser: any = null;

  ngOnInit(): void {
    this.getAllProducts();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getAllProducts(){
    this.produitService.getProduits().subscribe(
      (data) => {
        this.produits = data
      }
    );
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    const dropdown = (event.target as HTMLElement).closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  // Méthodes simples pour vérifier le rôle
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isEnseignant(): boolean {
    return this.authService.isEnseignant();
  }

  isEleve(): boolean {
    return this.authService.isEleve();
  }

  isParent(): boolean {
    return this.authService.isParent();
  }

  logout() {
    this.authService.logout();
  }

  title = 'l3_gl';
}
