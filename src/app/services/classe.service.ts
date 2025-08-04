import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Classe {
  id?: number;
  nom: string;
  niveau: string;
  capacite: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8000/api/classes';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les classes
  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
  }

  // Récupérer une classe par ID
  getClasse(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle classe
  createClasse(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe);
  }

  // Mettre à jour une classe
  updateClasse(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe);
  }

  // Supprimer une classe
  deleteClasse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer les classes par niveau
  getClassesByNiveau(niveau: string): Observable<Classe[]> {
    return this.http.get<Classe[]>(`${this.apiUrl}?niveau=${niveau}`);
  }
} 