import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface Note {
  id?: number;
  eleve_id: number;
  matiere_id: number;
  enseignant_id: number;
  note: number;
  periode: string;
  appreciation?: string;
  date_evaluation: string;
  created_at?: string;
  updated_at?: string;
}

export interface NoteWithDetails extends Note {
  eleve?: {
    id: number;
    nom: string;
    prenom: string;
  };
  matiere?: {
    id: number;
    nom: string;
    coefficient: number;
  };
  enseignant?: {
    id: number;
    nom: string;
    prenom: string;
  };
}

export interface MoyenneEleve {
  eleve_id: number;
  eleve_nom: string;
  eleve_prenom: string;
  moyenne: number;
  mention: string;
  rang?: number;
}

export interface StatistiquesNotes {
  total_notes: number;
  moyenne_generale: number;
  notes_par_periode: any[];
  notes_par_matiere: any[];
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les notes
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  // Récupérer une note par ID
  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle note
  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  // Mettre à jour une note
  updateNote(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note);
  }

  // Supprimer une note
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer les notes d'un élève
  getNotesByEleve(eleveId: number): Observable<NoteWithDetails[]> {
    return this.http.get<NoteWithDetails[]>(`${this.apiUrl}/eleve/${eleveId}`);
  }

  // Récupérer les notes d'une matière
  getNotesByMatiere(matiereId: number): Observable<NoteWithDetails[]> {
    return this.http.get<NoteWithDetails[]>(`${this.apiUrl}/matiere/${matiereId}`);
  }

  // Récupérer les notes par période
  getNotesByPeriode(periode: string): Observable<NoteWithDetails[]> {
    return this.http.get<NoteWithDetails[]>(`${this.apiUrl}/periode/${periode}`);
  }

  // Calculer la moyenne d'un élève
  calculerMoyenne(eleveId: number): Observable<MoyenneEleve> {
    return this.http.get<MoyenneEleve>(`${this.apiUrl}/moyenne/${eleveId}`);
  }

  // Calculer la moyenne d'un élève par période
  calculerMoyennePeriode(eleveId: number, periode: string): Observable<MoyenneEleve> {
    return this.http.get<MoyenneEleve>(`${this.apiUrl}/moyenne/${eleveId}/${periode}`);
  }

  // Récupérer les statistiques des notes
  getStatistiques(): Observable<StatistiquesNotes> {
    return this.http.get<StatistiquesNotes>(`${this.apiUrl}/statistiques`);
  }

  // Récupérer les notes avec tous les détails
  getNotesWithDetails(): Observable<NoteWithDetails[]> {
    return this.http.get<NoteWithDetails[]>(`${this.apiUrl}?with=eleve,matiere,enseignant`);
  }

  // Valider une note (entre 0 et 20)
  validateNote(note: number): boolean {
    return note >= 0 && note <= 20;
  }

  // Calculer la mention automatiquement
  calculerMention(moyenne: number): string {
    if (moyenne >= 16) return 'Très Bien';
    if (moyenne >= 14) return 'Bien';
    if (moyenne >= 12) return 'Assez Bien';
    if (moyenne >= 10) return 'Passable';
    return 'Insuffisant';
  }

  // Générer un bulletin PDF
  genererBulletin(eleveId: number, periode: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/bulletin/${eleveId}/${periode}`, {
      responseType: 'blob'
    });
  }
} 