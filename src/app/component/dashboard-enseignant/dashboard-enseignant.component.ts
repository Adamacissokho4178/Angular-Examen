import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NoteService } from '../../services/note.service';
import { AffectationService } from '../../services/affectation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Added HttpClient import

@Component({
  selector: 'app-dashboard-enseignant',
  templateUrl: './dashboard-enseignant.component.html',
  styleUrls: ['./dashboard-enseignant.component.css']
})
export class DashboardEnseignantComponent implements OnInit {
  
  // Données de l'enseignant connecté
  enseignantConnecte: any = null;
  
  // Classes et matières de l'enseignant
  mesAffectations: any[] = [];
  
  // Données pour la saisie des notes
  elevesClasse: any[] = [];
  periodeActuelle = 'T1';
  periodes = ['T1', 'T2', 'T3'];
  
  // Formulaire de saisie des notes
  noteForm: FormGroup;
  
  // États
  loading = false;
  error = '';
  showSaisieNotes = false;
  classeSelectionnee = '';
  matiereSelectionnee = '';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private noteService: NoteService,
    private affectationService: AffectationService,
    private fb: FormBuilder,
    private http: HttpClient // Added HttpClient injection
  ) {
    this.noteForm = this.fb.group({
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      appreciation: ['']
    });
  }

  ngOnInit(): void {
    this.chargerDonneesEnseignant();
  }

  // Charger les données de l'enseignant connecté
  chargerDonneesEnseignant() {
    this.loading = true;
    
    // Récupérer l'enseignant connecté
    this.enseignantConnecte = this.authService.getCurrentUser();
    
    if (!this.enseignantConnecte || this.enseignantConnecte.role !== 'enseignant') {
      this.router.navigate(['/login']);
      return;
    }
    
    // Charger les affectations de l'enseignant
    this.chargerMesAffectations();
  }

  // Charger les classes et matières de l'enseignant
  chargerMesAffectations() {
    this.affectationService.getAffectations().subscribe({
      next: (affectations) => {
        // Filtrer seulement les affectations de l'enseignant connecté
        this.mesAffectations = affectations.filter(aff => 
          aff.enseignant_id === this.enseignantConnecte.id
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des affectations:', error);
        this.error = 'Erreur lors du chargement de vos classes';
        this.loading = false;
      }
    });
  }

  // Ouvrir la saisie des notes pour une classe/matière
  ouvrirSaisieNotes(classe: string, matiere: string) {
    this.classeSelectionnee = classe;
    this.matiereSelectionnee = matiere;
    this.chargerElevesClasse(classe);
    this.showSaisieNotes = true;
  }

  // Charger les élèves d'une classe
  chargerElevesClasse(classe: string) {
    this.loading = true;
    
    // Récupérer l'ID de la classe
    const classeId = this.getClasseId(classe);
    
    if (classeId === 0) {
      this.error = 'Classe non trouvée';
      this.loading = false;
      return;
    }
    
    // Appeler l'API pour récupérer les vrais élèves
    this.http.get(`${this.noteService.apiUrl}/eleves-classe/${classeId}`).subscribe({
      next: (eleves: any) => {
        // Ajouter les champs pour les notes
        this.elevesClasse = eleves.map((eleve: any) => ({
          ...eleve,
          note: null,
          appreciation: '',
          sauvegarde: false
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des élèves:', error);
        this.error = 'Erreur lors du chargement des élèves';
        this.loading = false;
      }
    });
  }

  // Sauvegarder une note
  sauvegarderNote(eleve: any) {
    if (eleve.note !== null && eleve.note >= 0 && eleve.note <= 20) {
      const noteData = {
        eleve_id: eleve.id,
        matiere_id: this.getMatiereId(this.matiereSelectionnee),
        classe_id: this.getClasseId(this.classeSelectionnee),
        enseignant_id: this.enseignantConnecte.id,
        note: eleve.note,
        appreciation: eleve.appreciation,
        periode: this.periodeActuelle
      };

      this.noteService.createNote(noteData).subscribe({
        next: (response) => {
          console.log('Note sauvegardée:', response);
          // Marquer comme sauvegardé
          eleve.sauvegarde = true;
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          eleve.sauvegarde = false;
        }
      });
    }
  }

  // Sauvegarder toutes les notes
  sauvegarderToutesNotes() {
    this.elevesClasse.forEach(eleve => {
      if (eleve.note !== null) {
        this.sauvegarderNote(eleve);
      }
    });
  }

  // Fermer la saisie des notes
  fermerSaisieNotes() {
    this.showSaisieNotes = false;
    this.classeSelectionnee = '';
    this.matiereSelectionnee = '';
    this.elevesClasse = [];
  }

  // Méthodes utilitaires
  getMatiereId(nomMatiere: string): number {
    const affectation = this.mesAffectations.find(aff => aff.matiere?.nom === nomMatiere);
    return affectation?.matiere_id || 0;
  }

  getClasseId(nomClasse: string): number {
    const affectation = this.mesAffectations.find(aff => aff.classe?.nom === nomClasse);
    return affectation?.classe_id || 0;
  }

  // Déconnexion
  deconnexion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 