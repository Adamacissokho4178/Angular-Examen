import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Note {
  id: number;
  eleve_id: number;
  matiere_id: number;
  classe_id: number;
  enseignant_id?: number;
  note: number;
  appreciation?: string;
  periode: string;
  created_at: string;
  updated_at: string;
}

export interface NoteWithDetails extends Note {
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    matricule: string;
  };
  matiere: {
    id: number;
    nom: string;
    coefficient?: number;
  };
  classe: {
    id: number;
    nom: string;
  };
  enseignant?: {
    id: number;
    nom: string;
    prenom: string;
  };
  date_evaluation?: string;
}

export interface SuiviNotes {
  classe: string;
  matiere: string;
  enseignant: string;
  trimestre: string;
  eleves_attendus: number;
  notes_saisies: number;
  pourcentage_avancement: number;
  derniere_saisie: string;
  statut: 'Terminé' | 'Incomplet' | 'Non commencé';
}

export interface StatistiquesNotes {
  total_notes: number;
  moyenne_generale: number;
  notes_excellentes: number;
  notes_bonnes: number;
  notes_moyennes: number;
  notes_passables: number;
  notes_insuffisantes: number;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Récupérer le suivi des notes détaillé
  getSuiviNotes(filtres?: {
    trimestre?: string;
    classe?: string;
    matiere?: string;
    enseignant?: string;
  }): Observable<SuiviNotes[]> {
    let url = `${this.apiUrl}/suivi-notes`;
    
    if (filtres) {
      const params = new URLSearchParams();
      if (filtres.trimestre) params.append('trimestre', filtres.trimestre);
      if (filtres.classe) params.append('classe', filtres.classe);
      if (filtres.matiere) params.append('matiere', filtres.matiere);
      if (filtres.enseignant) params.append('enseignant', filtres.enseignant);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.http.get<SuiviNotes[]>(url).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du suivi des notes:', error);
        return of([]);
      })
    );
  }

  // Récupérer les détails des notes pour une classe/matière/période spécifique
  getNotesDetails(classe: string, matiere: string, periode: string, enseignant: string): Observable<NoteWithDetails[]> {
    const url = `${this.apiUrl}/notes-details?classe=${classe}&matiere=${matiere}&periode=${periode}&enseignant=${enseignant}`;
    
    return this.http.get<NoteWithDetails[]>(url).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails des notes:', error);
        return of([]);
      })
    );
  }

  // Récupérer les statistiques des notes pour le dashboard
  getStatistiquesNotes(): Observable<StatistiquesNotes> {
    return this.http.get<StatistiquesNotes>(`${this.apiUrl}/statistiques-notes`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return of({
          total_notes: 0,
          moyenne_generale: 0,
          notes_excellentes: 0,
          notes_bonnes: 0,
          notes_moyennes: 0,
          notes_passables: 0,
          notes_insuffisantes: 0
        });
      })
    );
  }

  // Récupérer toutes les notes
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des notes:', error);
        return of([]);
      })
    );
  }

  // Récupérer une note par ID
  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/notes/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de la note:', error);
        return of({} as Note);
      })
    );
  }

  // Créer une nouvelle note
  createNote(noteData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes`, noteData).pipe(
      catchError(error => {
        console.error('Erreur lors de la création de la note:', error);
        return of(null);
      })
    );
  }

  // Mettre à jour une note
  updateNote(id: number, noteData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/notes/${id}`, noteData).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour de la note:', error);
        return of(null);
      })
    );
  }

  // Supprimer une note
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression de la note:', error);
        return of(null);
      })
    );
  }

  // Récupérer les notes avec détails
  getNotesWithDetails(): Observable<NoteWithDetails[]> {
    return this.http.get<NoteWithDetails[]>(`${this.apiUrl}/notes-with-details`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des notes avec détails:', error);
        return of([]);
      })
    );
  }

  // Récupérer les statistiques du dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard-stats`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques du dashboard:', error);
        return of({
          notes: 0,
          matieres: 0,
          classes: 0,
          affectations: 0,
          suiviNotes: 0
        });
      })
    );
  }

  // Obtenir l'URL de l'API
  getApiUrl(): string {
    return this.apiUrl;
  }

  // Récupérer les données des listes déroulantes
  getDropdownData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dropdown-data`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données des listes déroulantes:', error);
        return of({
          enseignants: [],
          matieres: [],
          classes: []
        });
      })
    );
  }

  // Récupérer le nombre total de suivi des notes
  getNombreSuiviNotes(): Observable<number> {
    return this.getSuiviNotes().pipe(
      map(suivi => suivi.length)
    );
  }
} 