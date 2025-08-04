import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-suivi-notes-details',
  templateUrl: './suivi-notes-details.component.html',
  styleUrls: ['./suivi-notes-details.component.css']
})
export class SuiviNotesDetailsComponent implements OnInit {
  
  // Paramètres de la route
  classe: string = '';
  matiere: string = '';
  periode: string = '';
  enseignant: string = '';

  // Données des notes
  notesDetails: any[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.classe = params['classe'] || '';
      this.matiere = params['matiere'] || '';
      this.periode = params['periode'] || '';
      this.enseignant = params['enseignant'] || '';
      
      this.loadNotesDetails();
    });
  }

  loadNotesDetails() {
    this.loading = true;
    this.error = '';

    // Simuler le chargement des notes détaillées
    // En réalité, cela devrait venir de l'API avec les vrais paramètres
    setTimeout(() => {
      // Données de test pour les notes détaillées
      this.notesDetails = [
        {
          id: 1,
          eleve: 'Diop',
          prenom: 'Fatou',
          matricule: 'ELE001',
          note: 15.5,
          appreciation: 'Bon travail, continuez ainsi',
          date_saisie: '03/08/2025 14:30'
        },
        {
          id: 2,
          eleve: 'Ndiaye',
          prenom: 'Moussa',
          matricule: 'ELE002',
          note: 18.0,
          appreciation: 'Excellent travail',
          date_saisie: '03/08/2025 14:25'
        },
        {
          id: 3,
          eleve: 'Ba',
          prenom: 'Aissatou',
          matricule: 'ELE003',
          note: 12.5,
          appreciation: 'Peut mieux faire',
          date_saisie: '03/08/2025 14:20'
        },
        {
          id: 4,
          eleve: 'Diallo',
          prenom: 'Amadou',
          matricule: 'ELE004',
          note: 16.0,
          appreciation: 'Bon niveau',
          date_saisie: '03/08/2025 14:15'
        },
        {
          id: 5,
          eleve: 'Sall',
          prenom: 'Mariama',
          matricule: 'ELE005',
          note: 14.0,
          appreciation: 'Satisfaisant',
          date_saisie: '03/08/2025 14:10'
        }
      ];

      this.loading = false;
    }, 1000);
  }

  // Retour à la liste
  retourListe() {
    this.router.navigate(['/suivi-notes']);
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