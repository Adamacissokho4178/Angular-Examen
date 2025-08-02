import { Component, OnInit } from '@angular/core';
import { NoteService, StatistiquesNotes } from '../../services/note.service';
import { EnseignantService, Enseignant } from '../../services/enseignant.service';
import { MatiereService, Matiere } from '../../services/matiere.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

export interface DashboardStats {
  totalNotes: number;
  totalEleves: number;
  totalMatieres: number;
  totalEnseignants: number;
  moyenneGenerale: number;
  meilleureNote: number;
  moinsBonneNote: number;
  notesParPeriode: { [key: string]: number };
  topMatieres: Array<{ nom: string; moyenne: number; coefficient: number }>;
  repartitionNotes: Array<{ mention: string; count: number; pourcentage: number; couleur: string }>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  stats: DashboardStats | null = null;
  selectedPeriode = 'toutes';
  selectedNiveau = 'tous';
  
  // Données pour les graphiques
  notes: any[] = [];
  matieres: Matiere[] = [];
  enseignants: Enseignant[] = [];
  
  // Périodes disponibles
  periodes = [
    { value: 'toutes', label: 'Toutes les périodes' },
    { value: 'trimestre1', label: '1er Trimestre' },
    { value: 'trimestre2', label: '2ème Trimestre' },
    { value: 'trimestre3', label: '3ème Trimestre' },
    { value: 'semestre1', label: '1er Semestre' },
    { value: 'semestre2', label: '2ème Semestre' },
    { value: 'annuel', label: 'Annuel' }
  ];

  // Niveaux disponibles
  niveaux = [
    { value: 'tous', label: 'Tous les niveaux' },
    { value: '6ème', label: '6ème' },
    { value: '5ème', label: '5ème' },
    { value: '4ème', label: '4ème' },
    { value: '3ème', label: '3ème' },
    { value: '2nde', label: '2nde' },
    { value: '1ère', label: '1ère' },
    { value: 'Terminale', label: 'Terminale' }
  ];

  constructor(
    private noteService: NoteService,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Charger les données du dashboard
  loadDashboardData(): void {
    this.loading = true;
    this.notificationService.loadingInfo('Chargement du tableau de bord...');

    Promise.all([
      this.loadNotes(),
      this.loadMatieres(),
      this.loadEnseignants()
    ]).then(() => {
      this.calculateStats();
      this.loading = false;
      this.notificationService.success('Tableau de bord mis à jour');
    }).catch((error) => {
      this.loading = false;
      this.notificationService.error('Erreur lors du chargement des données');
      console.error('Erreur:', error);
    });
  }

  // Charger les notes
  loadNotes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.noteService.getNotes().subscribe({
        next: (data) => {
          this.notes = data;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des notes:', error);
          reject(error);
        }
      });
    });
  }

  // Charger les matières
  loadMatieres(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.matiereService.getMatieres().subscribe({
        next: (data) => {
          this.matieres = data;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des matières:', error);
          reject(error);
        }
      });
    });
  }

  // Charger les enseignants
  loadEnseignants(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.enseignantService.getEnseignants().subscribe({
        next: (data) => {
          this.enseignants = data;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des enseignants:', error);
          reject(error);
        }
      });
    });
  }

  // Calculer les statistiques
  calculateStats(): void {
    if (!this.notes.length) {
      this.stats = this.getEmptyStats();
      return;
    }

    // Filtrer les notes selon les critères
    let filteredNotes = this.notes;
    
    if (this.selectedPeriode !== 'toutes') {
      filteredNotes = filteredNotes.filter(note => note.periode === this.selectedPeriode);
    }

    if (this.selectedNiveau !== 'tous') {
      filteredNotes = filteredNotes.filter(note => {
        const matiere = this.matieres.find(m => m.id === note.matiere_id);
        return matiere?.niveau === this.selectedNiveau;
      });
    }

    // Calculer les statistiques
    const totalNotes = filteredNotes.length;
    const totalEleves = new Set(filteredNotes.map(n => n.eleve_id)).size;
    const totalMatieres = new Set(filteredNotes.map(n => n.matiere_id)).size;
    const totalEnseignants = new Set(filteredNotes.map(n => n.enseignant_id)).size;

    const notesValues = filteredNotes.map(n => n.note);
    const moyenneGenerale = notesValues.length > 0 ? 
      notesValues.reduce((sum, note) => sum + note, 0) / notesValues.length : 0;
    
    const meilleureNote = Math.max(...notesValues, 0);
    const moinsBonneNote = Math.min(...notesValues, 20);

    // Notes par période
    const notesParPeriode: { [key: string]: number } = {};
    this.periodes.forEach(periode => {
      if (periode.value !== 'toutes') {
        notesParPeriode[periode.value] = this.notes.filter(n => n.periode === periode.value).length;
      }
    });

    // Top matières par moyenne
    const moyennesParMatiere = this.calculateMoyennesParMatiere(filteredNotes);
    const topMatieres = moyennesParMatiere
      .sort((a, b) => b.moyenne - a.moyenne)
      .slice(0, 5);

    // Répartition des notes par mention
    const repartitionNotes = this.calculateRepartitionNotes(filteredNotes);

    this.stats = {
      totalNotes,
      totalEleves,
      totalMatieres,
      totalEnseignants,
      moyenneGenerale: parseFloat(moyenneGenerale.toFixed(2)),
      meilleureNote,
      moinsBonneNote,
      notesParPeriode,
      topMatieres,
      repartitionNotes
    };
  }

  // Calculer les moyennes par matière
  calculateMoyennesParMatiere(notes: any[]): Array<{ nom: string; moyenne: number; coefficient: number }> {
    const moyennes: { [key: number]: { sum: number; count: number; nom: string; coefficient: number } } = {};

    notes.forEach(note => {
      const matiere = this.matieres.find(m => m.id === note.matiere_id);
      if (matiere) {
        if (!moyennes[note.matiere_id]) {
          moyennes[note.matiere_id] = {
            sum: 0,
            count: 0,
            nom: matiere.nom,
            coefficient: matiere.coefficient
          };
        }
        moyennes[note.matiere_id].sum += note.note;
        moyennes[note.matiere_id].count += 1;
      }
    });

    return Object.values(moyennes).map(m => ({
      nom: m.nom,
      moyenne: parseFloat((m.sum / m.count).toFixed(2)),
      coefficient: m.coefficient
    }));
  }

  // Calculer la répartition des notes par mention
  calculateRepartitionNotes(notes: any[]): Array<{ mention: string; count: number; pourcentage: number; couleur: string }> {
    const mentions = [
      { mention: 'Très Bien', min: 16, couleur: '#28a745' },
      { mention: 'Bien', min: 14, couleur: '#17a2b8' },
      { mention: 'Assez Bien', min: 12, couleur: '#ffc107' },
      { mention: 'Passable', min: 10, couleur: '#6c757d' },
      { mention: 'Insuffisant', min: 0, couleur: '#dc3545' }
    ];

    const total = notes.length;
    const repartition = mentions.map(m => {
      const count = notes.filter(n => n.note >= m.min && n.note < (m.min + 2)).length;
      return {
        mention: m.mention,
        count,
        pourcentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
        couleur: m.couleur
      };
    });

    return repartition.filter(r => r.count > 0);
  }

  // Obtenir des statistiques vides
  getEmptyStats(): DashboardStats {
    return {
      totalNotes: 0,
      totalEleves: 0,
      totalMatieres: 0,
      totalEnseignants: 0,
      moyenneGenerale: 0,
      meilleureNote: 0,
      moinsBonneNote: 0,
      notesParPeriode: {},
      topMatieres: [],
      repartitionNotes: []
    };
  }

  // Changer de période
  onPeriodeChange(): void {
    this.calculateStats();
  }

  // Changer de niveau
  onNiveauChange(): void {
    this.calculateStats();
  }

  // Rafraîchir les données
  refreshData(): void {
    this.loadDashboardData();
  }

  // Obtenir la classe CSS pour les badges de mention
  getMentionBadgeClass(mention: string): string {
    const classes: { [key: string]: string } = {
      'Très Bien': 'badge bg-success',
      'Bien': 'badge bg-info',
      'Assez Bien': 'badge bg-warning',
      'Passable': 'badge bg-secondary',
      'Insuffisant': 'badge bg-danger'
    };
    return classes[mention] || 'badge bg-secondary';
  }

  // Obtenir la classe CSS pour les cartes de statistiques
  getStatCardClass(index: number): string {
    const classes = [
      'bg-primary text-white',
      'bg-success text-white',
      'bg-info text-white',
      'bg-warning text-dark'
    ];
    return classes[index % classes.length];
  }

  // Obtenir l'icône pour les cartes de statistiques
  getStatIcon(index: number): string {
    const icons = [
      'fas fa-star',
      'fas fa-user-graduate',
      'fas fa-book',
      'fas fa-chalkboard-teacher'
    ];
    return icons[index % icons.length];
  }

  // Formater un nombre avec des espaces pour les milliers
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Obtenir le pourcentage de progression pour les barres de progression
  getProgressPercentage(value: number, max: number): number {
    return max > 0 ? (value / max) * 100 : 0;
  }

  // Obtenir le nombre de périodes avec des données
  getPeriodesCount(): number {
    if (!this.stats?.notesParPeriode) return 0;
    return Object.keys(this.stats.notesParPeriode).length;
  }

  // Obtenir le maximum de notes par période
  getMaxNotesPeriode(): number {
    if (!this.stats?.notesParPeriode) return 0;
    return Math.max(...Object.values(this.stats.notesParPeriode));
  }

  // Obtenir la date actuelle
  getCurrentDate(): Date {
    return new Date();
  }

  // Obtenir le titre du dashboard selon le rôle
  getDashboardTitle(): string {
    return this.authService.getDashboardTitle();
  }

  // Obtenir la description du dashboard selon le rôle
  getDashboardDescription(): string {
    return this.authService.getDashboardDescription();
  }

  // Obtenir le rôle actuel
  getCurrentRole(): string {
    const user = this.authService.getCurrentUser();
    return user?.role || '';
  }
} 