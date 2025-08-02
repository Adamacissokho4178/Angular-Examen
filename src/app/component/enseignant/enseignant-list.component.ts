import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnseignantService, Enseignant } from '../../services/enseignant.service';

@Component({
  selector: 'app-enseignant-list',
  templateUrl: './enseignant-list.component.html',
  styleUrls: ['./enseignant-list.component.css']
})
export class EnseignantListComponent implements OnInit {
  enseignants: Enseignant[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  filteredEnseignants: Enseignant[] = [];

  constructor(
    private enseignantService: EnseignantService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEnseignants();
  }

  // Charger tous les enseignants
  loadEnseignants(): void {
    this.loading = true;
    this.error = '';

    this.enseignantService.getEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data;
        this.filteredEnseignants = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des enseignants';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  // Rechercher des enseignants
  searchEnseignants(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEnseignants = this.enseignants;
      return;
    }

    this.filteredEnseignants = this.enseignants.filter(enseignant =>
      enseignant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      enseignant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      enseignant.specialite.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      enseignant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Naviguer vers le formulaire d'ajout
  addEnseignant(): void {
    this.router.navigate(['/enseignants/add']);
  }

  // Naviguer vers le formulaire de modification
  editEnseignant(id: number): void {
    this.router.navigate(['/enseignants/edit', id]);
  }

  // Supprimer un enseignant
  deleteEnseignant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.enseignantService.deleteEnseignant(id).subscribe({
        next: () => {
          this.enseignants = this.enseignants.filter(e => e.id !== id);
          this.filteredEnseignants = this.filteredEnseignants.filter(e => e.id !== id);
          alert('Enseignant supprimé avec succès');
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression';
          console.error('Erreur:', error);
        }
      });
    }
  }

  // Voir les détails d'un enseignant
  viewEnseignant(id: number): void {
    this.router.navigate(['/enseignants/view', id]);
  }

  // Rechercher par spécialité
  searchBySpecialite(specialite: string): void {
    this.loading = true;
    this.enseignantService.searchBySpecialite(specialite).subscribe({
      next: (data) => {
        this.filteredEnseignants = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  // Réinitialiser la recherche
  resetSearch(): void {
    this.searchTerm = '';
    this.filteredEnseignants = this.enseignants;
  }

  // Obtenir le nom complet de l'enseignant
  getFullName(enseignant: Enseignant): string {
    return `${enseignant.prenom} ${enseignant.nom}`;
  }

  // Vérifier si un enseignant a un téléphone
  hasTelephone(enseignant: Enseignant): boolean {
    return !!enseignant.telephone && enseignant.telephone.trim() !== '';
  }
} 