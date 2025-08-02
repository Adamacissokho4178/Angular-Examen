import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface Enseignant {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  telephone?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = `${environment.apiUrl}/enseignants`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les enseignants
  getEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.apiUrl);
  }

  // Récupérer un enseignant par ID
  getEnseignant(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel enseignant
  createEnseignant(enseignant: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.apiUrl, enseignant);
  }

  // Mettre à jour un enseignant
  updateEnseignant(id: number, enseignant: Enseignant): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.apiUrl}/${id}`, enseignant);
  }

  // Supprimer un enseignant
  deleteEnseignant(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Rechercher des enseignants par spécialité
  searchBySpecialite(specialite: string): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}?specialite=${specialite}`);
  }

  // Récupérer les enseignants avec leurs matières
  getEnseignantsWithMatieres(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}?with=matieres`);
  }
} 