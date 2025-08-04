import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Affectation {
  id?: number;
  enseignant_id: number;
  matiere_id: number;
  classe_id: number;
  enseignant?: any;
  matiere?: any;
  classe?: any;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AffectationService {
  private apiUrl = 'http://localhost:8000/api/affectations';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les affectations
  getAffectations(): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(this.apiUrl);
  }

  // Récupérer une affectation par ID
  getAffectation(id: number): Observable<Affectation> {
    return this.http.get<Affectation>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle affectation
  createAffectation(affectation: Affectation): Observable<any> {
    return this.http.post(this.apiUrl, affectation);
  }

  // Mettre à jour une affectation
  updateAffectation(id: number, affectation: Affectation): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, affectation);
  }

  // Supprimer une affectation
  deleteAffectation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
