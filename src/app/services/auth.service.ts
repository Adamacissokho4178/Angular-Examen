import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'enseignant' | 'eleve' | 'parent';
  specialite?: string; // Pour les enseignants
  classe?: string; // Pour les élèves
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: 'admin' | 'enseignant' | 'eleve' | 'parent';
  specialite?: string;
  classe?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {
    // Vérifier si localStorage est disponible (côté client uniquement)
    if (typeof window !== 'undefined' && window.localStorage) {
      // Essayer de récupérer l'utilisateur depuis localStorage
      const savedUser = localStorage.getItem('currentUser');
      const savedToken = localStorage.getItem('authToken');
      
      if (savedUser && savedToken) {
        try {
          const user = JSON.parse(savedUser);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Erreur lors du parsing de l\'utilisateur:', error);
        }
      }
    }
  }

  // Méthode pour créer un utilisateur admin de test (pour développement)
  createTestAdmin(): void {
    const testUser: User = {
      id: 1,
      nom: 'Admin',
      prenom: 'Test',
      email: 'admin@ecole.fr',
      role: 'admin',
      specialite: 'Administration'
    };
    
    const testToken = 'test-token-12345';
    
    this.setCurrentUser(testUser);
    this.setToken(testToken);
  }

  // Méthode de connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  // Méthode d'inscription
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  // Définir l'utilisateur actuel
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    // Vérifier si localStorage est disponible avant de l'utiliser
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Obtenir le token d'authentification
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Définir le token d'authentification
  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('authToken', token);
    }
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null && this.getToken() !== null;
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
    // Vérifier si localStorage est disponible avant de l'utiliser
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
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