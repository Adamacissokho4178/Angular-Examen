import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface Matiere {
  id?: number;
  nom: string;
  niveau: string;
  coefficient: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private apiUrl = `${environment.apiUrl}/matieres`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les matières
  getMatieres(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.apiUrl);
  }

  // Récupérer une matière par ID
  getMatiere(id: number): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle matière
  createMatiere(matiere: Matiere): Observable<Matiere> {
    return this.http.post<Matiere>(this.apiUrl, matiere);
  }

  // Mettre à jour une matière
  updateMatiere(id: number, matiere: Matiere): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.apiUrl}/${id}`, matiere);
  }

  // Supprimer une matière
  deleteMatiere(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer les matières par niveau
  getMatieresByNiveau(niveau: string): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.apiUrl}/niveau/${niveau}`);
  }

  // Rechercher des matières par nom
  searchMatieres(nom: string): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.apiUrl}?nom=${nom}`);
  }

  // Récupérer les matières avec leurs enseignants
  getMatieresWithEnseignants(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.apiUrl}?with=enseignants`);
  }

  // Récupérer les niveaux disponibles
  getNiveaux(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/niveaux`);
  }

  // Valider le coefficient (entre 0.1 et 10)
  validateCoefficient(coefficient: number): boolean {
    return coefficient >= 0.1 && coefficient <= 10;
  }
} 