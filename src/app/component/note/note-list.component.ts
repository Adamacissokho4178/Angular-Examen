import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, NoteWithDetails } from '../../services/note.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  notes: NoteWithDetails[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedPeriode = '';
  selectedMatiere = '';
  filteredNotes: NoteWithDetails[] = [];

  // Liste des périodes disponibles
  periodes = [
    'trimestre1',
    'trimestre2',
    'trimestre3',
    'semestre1',
    'semestre2'
  ];

  // Liste des types d'évaluation
  typesEvaluation = [
    'Contrôle',
    'Devoir',
    'Examen',
    'Interrogation',
    'Projet',
    'Oral'
  ];

  constructor(
    private noteService: NoteService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadNotes();
  }

  // Charger toutes les notes
  loadNotes(): void {
    this.loading = true;
    this.error = '';

    this.noteService.getNotesWithDetails().subscribe({
      next: (data: any) => {
        this.notes = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des notes:', error);
        this.loading = false;
      }
    });
  }

  // Rechercher des notes
  searchNotes(): void {
    if (!this.searchTerm.trim() && !this.selectedPeriode && !this.selectedMatiere) {
      this.filteredNotes = this.notes;
      return;
    }

    this.filteredNotes = this.notes.filter(note => {
      const matchesSearch = !this.searchTerm.trim() || 
        note.eleve?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        note.eleve?.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        note.matiere?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        note.enseignant?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        note.enseignant?.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesPeriode = !this.selectedPeriode || note.periode === this.selectedPeriode;
      const matchesMatiere = !this.selectedMatiere || note.matiere?.nom === this.selectedMatiere;

      return matchesSearch && matchesPeriode && matchesMatiere;
    });
  }

  // Naviguer vers le formulaire d'ajout
  addNote(): void {
    this.router.navigate(['/notes/add']);
  }

  // Naviguer vers le formulaire de modification
  editNote(id: number): void {
    this.router.navigate(['/notes/edit', id]);
  }

  // Supprimer une note
  deleteNote(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(note => note.id !== id);
          this.filteredNotes = this.filteredNotes.filter(note => note.id !== id);
          this.notificationService.success('Note supprimée avec succès');
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          this.notificationService.error('Erreur lors de la suppression de la note');
        }
      });
    }
  }

  // Voir les détails d'une note
  viewNote(id: number): void {
    this.router.navigate(['/notes/view', id]);
  }

  // Filtrer par période
  filterByPeriode(periode: string): void {
    this.selectedPeriode = periode;
    this.searchNotes();
  }

  // Filtrer par matière
  filterByMatiere(matiere: string): void {
    this.selectedMatiere = matiere;
    this.searchNotes();
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedPeriode = '';
    this.selectedMatiere = '';
    this.filteredNotes = this.notes;
  }

  // Obtenir la couleur du badge selon la note
  getNoteBadgeClass(note: number): string {
    if (note >= 16) return 'bg-success';
    if (note >= 12) return 'bg-info';
    if (note >= 10) return 'bg-warning';
    return 'bg-danger';
  }

  // Obtenir la couleur du badge selon la période
  getPeriodeBadgeClass(periode: string): string {
    const periodeColors: { [key: string]: string } = {
      'trimestre1': 'bg-primary',
      'trimestre2': 'bg-success',
      'trimestre3': 'bg-info',
      'semestre1': 'bg-warning',
      'semestre2': 'bg-danger'
    };
    return periodeColors[periode] || 'bg-secondary';
  }

  // Obtenir la couleur du badge selon le type d'évaluation
  getTypeEvaluationBadgeClass(type: string): string {
    const typeColors: { [key: string]: string } = {
      'Contrôle': 'bg-primary',
      'Devoir': 'bg-success',
      'Examen': 'bg-danger',
      'Interrogation': 'bg-warning',
      'Projet': 'bg-info',
      'Oral': 'bg-secondary'
    };
    return typeColors[type] || 'bg-secondary';
  }

  // Obtenir la mention selon la note
  getMention(note: number): string {
    if (note >= 16) return 'Très Bien';
    if (note >= 14) return 'Bien';
    if (note >= 12) return 'Assez Bien';
    if (note >= 10) return 'Passable';
    return 'Insuffisant';
  }

  // Obtenir le nom complet de l'élève
  getEleveFullName(note: NoteWithDetails): string {
    if (note.eleve) {
      return `${note.eleve.prenom} ${note.eleve.nom}`;
    }
    return 'Élève inconnu';
  }

  // Obtenir le nom complet de l'enseignant
  getEnseignantFullName(note: NoteWithDetails): string {
    if (note.enseignant) {
      return `${note.enseignant.prenom} ${note.enseignant.nom}`;
    }
    return 'Enseignant inconnu';
  }

  // Trier les notes par note (décroissant)
  sortByNote(): void {
    this.filteredNotes.sort((a, b) => b.note - a.note);
  }

  // Trier les notes par date d'évaluation
  sortByDate(): void {
    // Trier par date d'évaluation (plus récent en premier)
    this.filteredNotes.sort((a, b) => {
      const dateA = a.date_evaluation ? new Date(a.date_evaluation).getTime() : 0;
      const dateB = b.date_evaluation ? new Date(b.date_evaluation).getTime() : 0;
      return dateB - dateA;
    });
  }

  // Trier les notes par élève
  sortByEleve(): void {
    this.filteredNotes.sort((a, b) => {
      const nomA = this.getEleveFullName(a);
      const nomB = this.getEleveFullName(b);
      return nomA.localeCompare(nomB);
    });
  }

  // Trier les notes par matière
  sortByMatiere(): void {
    this.filteredNotes.sort((a, b) => {
      const matiereA = a.matiere?.nom || '';
      const matiereB = b.matiere?.nom || '';
      return matiereA.localeCompare(matiereB);
    });
  }

  // Obtenir les statistiques
  getStats(): { 
    total: number, 
    moyenne: number, 
    byPeriode: { [key: string]: number }, 
    byMatiere: { [key: string]: number },
    mentions: { [key: string]: number }
  } {
    const total = this.filteredNotes.length;
    let totalNotes = 0;
    const byPeriode: { [key: string]: number } = {};
    const byMatiere: { [key: string]: number } = {};
    const mentions: { [key: string]: number } = {};

    this.filteredNotes.forEach(note => {
      totalNotes += note.note;
      
      byPeriode[note.periode] = (byPeriode[note.periode] || 0) + 1;
      
      if (note.matiere?.nom) {
        byMatiere[note.matiere.nom] = (byMatiere[note.matiere.nom] || 0) + 1;
      }

      const mention = this.getMention(note.note);
      mentions[mention] = (mentions[mention] || 0) + 1;
    });

    const moyenne = total > 0 ? totalNotes / total : 0;

    return { total, moyenne, byPeriode, byMatiere, mentions };
  }

  // Obtenir la liste unique des matières
  getMatieres(): string[] {
    const matieres = this.notes
      .map(note => note.matiere?.nom)
      .filter((nom, index, array) => nom && array.indexOf(nom) === index);
    return matieres.sort() as string[];
  }

  // Obtenir le nombre de périodes
  getPeriodesCount(): number {
    const stats = this.getStats();
    if (!stats?.byPeriode) return 0;
    return Object.keys(stats.byPeriode).length;
  }

  // Obtenir le nombre de matières
  getMatieresCount(): number {
    const stats = this.getStats();
    if (!stats?.byMatiere) return 0;
    return Object.keys(stats.byMatiere).length;
  }

  // Formater la date
  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  }
} 