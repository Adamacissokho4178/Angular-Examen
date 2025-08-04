import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';
import { ClasseService } from '../../services/classe.service';
import { AffectationService } from '../../services/affectation.service';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-suivi-notes',
  templateUrl: './suivi-notes.component.html',
  styleUrls: ['./suivi-notes.component.css']
})
export class SuiviNotesComponent implements OnInit {
  
  // Données pour le tableau de suivi des notes
  suiviNotes: any[] = [];
  loading = false;
  error = '';

  // Filtres pour le tableau
  selectedPeriode = 'T1';
  selectedClasse = '';
  selectedMatiere = '';
  selectedEnseignant = '';

  periodes = ['T1', 'T2', 'T3'];
  classes: any[] = [];
  matieres: any[] = [];
  enseignants: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private enseignantService: EnseignantService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    private affectationService: AffectationService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.loadSuiviNotes();
    this.loadFiltres();
  }

  loadFiltres() {
    // Charger les données pour les filtres
    this.classeService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des classes:', error);
        // Données de test
        this.classes = [
          { id: 1, nom: '6ème A' },
          { id: 2, nom: '5ème B' },
          { id: 3, nom: '4ème C' }
        ];
      }
    });

    this.matiereService.getMatieres().subscribe({
      next: (matieres) => {
        this.matieres = matieres;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matières:', error);
        // Données de test
        this.matieres = [
          { id: 1, nom: 'Mathématiques' },
          { id: 2, nom: 'Français' },
          { id: 3, nom: 'Histoire' }
        ];
      }
    });

    this.enseignantService.getEnseignants().subscribe({
      next: (enseignants) => {
        this.enseignants = enseignants;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des enseignants:', error);
        // Données de test
        this.enseignants = [
          { id: 1, nom: 'Ndiaye', prenom: 'Moussa' },
          { id: 2, nom: 'Ba', prenom: 'Fatou' },
          { id: 3, nom: 'Diallo', prenom: 'Amadou' }
        ];
      }
    });
  }

  loadSuiviNotes() {
    this.loading = true;
    this.error = '';

    // Utiliser le service NoteService pour récupérer les vraies données
    const filtres = {
      trimestre: this.selectedPeriode,
      classe: this.selectedClasse,
      matiere: this.selectedMatiere,
      enseignant: this.selectedEnseignant
    };

    this.noteService.getSuiviNotes(filtres).subscribe({
      next: (data) => {
        this.suiviNotes = data.map(item => ({
          classe: item.classe,
          matiere: item.matiere,
          enseignant: item.enseignant,
          periode: item.trimestre,
          elevesAttendus: item.eleves_attendus,
          notesSaisies: item.notes_saisies,
          pourcentage: item.pourcentage_avancement,
          derniereSaisie: item.derniere_saisie,
          statut: this.getStatutDisplay(item.statut)
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du suivi des notes:', error);
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
      }
    });
  }

  // Méthode pour afficher le statut avec les icônes
  getStatutDisplay(statut: string): string {
    switch (statut) {
      case 'Terminé':
        return '✅ Terminé';
      case 'Incomplet':
        return '⚠️ Incomplet';
      case 'Non commencé':
        return '❌ Non commencé';
      default:
        return statut;
    }
  }

  // Filtrage du tableau
  filterSuiviNotes() {
    this.loadSuiviNotes();
  }

  // Navigation vers les détails d'une ligne
  voirDetails(item: any) {
    this.router.navigate(['/suivi-notes/details'], {
      queryParams: {
        classe: item.classe,
        matiere: item.matiere,
        periode: item.periode,
        enseignant: item.enseignant
      }
    });
  }

  // Retour au dashboard
  retourDashboard() {
    this.router.navigate(['/dashboard-admin']);
  }

  // Méthodes pour vérifier les permissions
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
