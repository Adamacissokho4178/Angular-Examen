import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(
    private authService: AuthService
  ){}

  currentUser: any = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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

  title = 'Portail Scolaire';
}
