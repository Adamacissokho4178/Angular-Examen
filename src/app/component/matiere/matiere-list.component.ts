import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatiereService, Matiere } from '../../services/matiere.service';

@Component({
  selector: 'app-matiere-list',
  templateUrl: './matiere-list.component.html',
  styleUrls: ['./matiere-list.component.css']
})
export class MatiereListComponent implements OnInit {
  matieres: Matiere[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedNiveau = '';
  filteredMatieres: Matiere[] = [];

  // Liste des niveaux disponibles
  niveaux = [
    '6ème',
    '5ème',
    '4ème',
    '3ème',
    '2nde',
    '1ère',
    'Terminale'
  ];

  constructor(
    private matiereService: MatiereService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMatieres();
  }

  // Charger toutes les matières
  loadMatieres(): void {
    this.loading = true;
    this.error = '';

    this.matiereService.getMatieres().subscribe({
      next: (data) => {
        this.matieres = data;
        this.filteredMatieres = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des matières';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  // Rechercher des matières
  searchMatieres(): void {
    if (!this.searchTerm.trim() && !this.selectedNiveau) {
      this.filteredMatieres = this.matieres;
      return;
    }

    this.filteredMatieres = this.matieres.filter(matiere => {
      const matchesSearch = !this.searchTerm.trim() || 
        matiere.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (matiere.description && matiere.description.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesNiveau = !this.selectedNiveau || matiere.niveau === this.selectedNiveau;

      return matchesSearch && matchesNiveau;
    });
  }

  // Naviguer vers le formulaire d'ajout
  addMatiere(): void {
    this.router.navigate(['/matieres/add']);
  }

  // Naviguer vers le formulaire de modification
  editMatiere(id: number): void {
    this.router.navigate(['/matieres/edit', id]);
  }

  // Supprimer une matière
  deleteMatiere(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      this.matiereService.deleteMatiere(id).subscribe({
        next: () => {
          this.matieres = this.matieres.filter(m => m.id !== id);
          this.filteredMatieres = this.filteredMatieres.filter(m => m.id !== id);
          alert('Matière supprimée avec succès');
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression';
          console.error('Erreur:', error);
        }
      });
    }
  }

  // Voir les détails d'une matière
  viewMatiere(id: number): void {
    this.router.navigate(['/matieres/view', id]);
  }

  // Filtrer par niveau
  filterByNiveau(niveau: string): void {
    this.selectedNiveau = niveau;
    this.searchMatieres();
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedNiveau = '';
    this.filteredMatieres = this.matieres;
  }

  // Obtenir la couleur du badge selon le niveau
  getNiveauBadgeClass(niveau: string): string {
    const niveauColors: { [key: string]: string } = {
      '6ème': 'bg-primary',
      '5ème': 'bg-success',
      '4ème': 'bg-info',
      '3ème': 'bg-warning',
      '2nde': 'bg-secondary',
      '1ère': 'bg-danger',
      'Terminale': 'bg-dark'
    };
    return niveauColors[niveau] || 'bg-secondary';
  }

  // Obtenir la couleur du badge selon le coefficient
  getCoefficientBadgeClass(coefficient: number): string {
    if (coefficient >= 4) return 'bg-danger';
    if (coefficient >= 2) return 'bg-warning';
    if (coefficient >= 1) return 'bg-success';
    return 'bg-secondary';
  }

  // Vérifier si une matière a une description
  hasDescription(matiere: Matiere): boolean {
    return !!matiere.description && matiere.description.trim() !== '';
  }

  // Obtenir un aperçu de la description
  getDescriptionPreview(description: string): string {
    if (description.length <= 50) return description;
    return description.substring(0, 50) + '...';
  }

  // Trier les matières par nom
  sortByName(): void {
    this.filteredMatieres.sort((a, b) => a.nom.localeCompare(b.nom));
  }

  // Trier les matières par niveau
  sortByNiveau(): void {
    const niveauOrder = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];
    this.filteredMatieres.sort((a, b) => {
      const aIndex = niveauOrder.indexOf(a.niveau);
      const bIndex = niveauOrder.indexOf(b.niveau);
      return aIndex - bIndex;
    });
  }

  // Trier les matières par coefficient
  sortByCoefficient(): void {
    this.filteredMatieres.sort((a, b) => b.coefficient - a.coefficient);
  }

  // Obtenir les statistiques
  getStats(): { total: number, byNiveau: { [key: string]: number }, avgCoefficient: number } {
    const total = this.filteredMatieres.length;
    const byNiveau: { [key: string]: number } = {};
    let totalCoefficient = 0;

    this.filteredMatieres.forEach(matiere => {
      byNiveau[matiere.niveau] = (byNiveau[matiere.niveau] || 0) + 1;
      totalCoefficient += matiere.coefficient;
    });

    const avgCoefficient = total > 0 ? totalCoefficient / total : 0;

    return { total, byNiveau, avgCoefficient };
  }

  // Obtenir le nombre de niveaux différents
  getNiveauxCount(): number {
    const stats = this.getStats();
    return Object.keys(stats.byNiveau).length;
  }
} 