import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClasseService, Classe } from '../../../services/classe.service';

@Component({
  selector: 'app-classe-list',
  templateUrl: './classe-list.component.html',
  styleUrls: ['./classe-list.component.css']
})
export class ClasseListComponent implements OnInit {
  classes: Classe[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedNiveau = '';

  niveaux = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

  constructor(
    private classeService: ClasseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.error = '';

    this.classeService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des classes';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  addClasse(): void {
    this.router.navigate(['/classes/ajout']);
  }

  editClasse(id: number): void {
    this.router.navigate(['/classes/edit', id]);
  }

  deleteClasse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      this.classeService.deleteClasse(id).subscribe({
        next: () => {
          this.loadClasses();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error('Erreur:', err);
        }
      });
    }
  }

  filterClasses(): Classe[] {
    let filtered = this.classes;

    if (this.searchTerm) {
      filtered = filtered.filter(classe =>
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        classe.niveau.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedNiveau) {
      filtered = filtered.filter(classe => classe.niveau === this.selectedNiveau);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedNiveau = '';
  }

  getNiveauColor(niveau: string): string {
    const colors: { [key: string]: string } = {
      '6ème': '#e74c3c',
      '5ème': '#e67e22',
      '4ème': '#f39c12',
      '3ème': '#f1c40f',
      '2nde': '#27ae60',
      '1ère': '#3498db',
      'Terminale': '#9b59b6'
    };
    return colors[niveau] || '#95a5a6';
  }

  // Méthode pour calculer le total des capacités
  getTotalCapacite(): number {
    return this.classes.reduce((total, classe) => total + (classe.capacite || 0), 0);
  }
}
