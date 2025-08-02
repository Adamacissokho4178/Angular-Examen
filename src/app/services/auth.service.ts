import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'enseignant' | 'eleve' | 'parent';
  specialite?: string; // Pour les enseignants
  classe?: string; // Pour les élèves
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Simuler un utilisateur connecté (à remplacer par l'authentification réelle)
    this.setCurrentUser({
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@ecole.fr',
      role: 'enseignant',
      specialite: 'Mathématiques'
    });
  }

  // Définir l'utilisateur actuel
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Vérifier le rôle de l'utilisateur
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Vérifier si l'utilisateur a un des rôles
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Déconnexion
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  // Méthodes simples pour vérifier le rôle
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isEnseignant(): boolean {
    return this.hasRole('enseignant');
  }

  isEleve(): boolean {
    return this.hasRole('eleve');
  }

  isParent(): boolean {
    return this.hasRole('parent');
  }

  // Obtenir le titre du dashboard selon le rôle
  getDashboardTitle(): string {
    const user = this.getCurrentUser();
    if (!user) return 'Dashboard';

    switch (user.role) {
      case 'admin':
        return 'Dashboard Administrateur';
      case 'enseignant':
        return 'Dashboard Enseignant';
      case 'eleve':
        return 'Dashboard Élève';
      case 'parent':
        return 'Dashboard Parent';
      default:
        return 'Dashboard';
    }
  }

  // Obtenir la description du dashboard selon le rôle
  getDashboardDescription(): string {
    const user = this.getCurrentUser();
    if (!user) return '';

    switch (user.role) {
      case 'admin':
        return 'Gérez l\'ensemble du système académique, les utilisateurs et les configurations.';
      case 'enseignant':
        return 'Saisissez les notes de vos classes et consultez les bulletins.';
      case 'eleve':
        return 'Consultez vos notes, moyennes et bulletins.';
      case 'parent':
        return 'Suivez la progression scolaire de votre enfant.';
      default:
        return '';
    }
  }
} 