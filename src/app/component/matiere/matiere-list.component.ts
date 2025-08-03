import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatiereService, Matiere } from '../../services/matiere.service';
import { AuthService } from '../../services/auth.service';

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
  showListSection = false; // Initialisé à false
  showAddForm = false; // Ajouté pour gérer l'affichage du formulaire d'ajout
  matiereForm: FormGroup; // Formulaire pour l'ajout de matière
  isEditMode = false; // Mode édition
  editingMatiereId: number | null = null; // ID de la matière en cours d'édition

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
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Initialiser le formulaire
    this.matiereForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      niveau: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(0.1), Validators.max(10)]],
      description: ['', Validators.maxLength(1000)]
    });
  }

  ngOnInit(): void {
    // Créer un utilisateur admin de test si aucun utilisateur n'est connecté
    if (!this.authService.isLoggedIn()) {
      this.authService.createTestAdmin();
    }
    
    // Charger directement les matières
    this.loadMatieres();
  }

  // Naviguer vers le formulaire d'ajout
  addMatiere(): void {
    // Afficher le formulaire d'ajout
    this.showAddForm = true;
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

  // Voir les détails d'une matière
  viewMatiere(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.matiereService.getMatiere(id).subscribe({
      next: (matiere) => {
        this.loading = false;
        // Afficher les détails dans une alerte pour l'instant
        alert(`Détails de la matière:\n\nNom: ${matiere.nom}\nNiveau: ${matiere.niveau}\nCoefficient: ${matiere.coefficient}\nDescription: ${matiere.description || 'Aucune description'}`);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Erreur lors du chargement des détails de la matière';
        console.error('Erreur:', error);
      }
    });
  }

  // Naviguer vers le formulaire de modification
  editMatiere(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.matiereService.getMatiere(id).subscribe({
      next: (matiere) => {
        this.loading = false;
        // Remplir le formulaire avec les données de la matière
        this.matiereForm.patchValue({
          nom: matiere.nom,
          niveau: matiere.niveau,
          coefficient: matiere.coefficient,
          description: matiere.description || ''
        });
        
        // Afficher le formulaire en mode édition
        this.showAddForm = true;
        this.isEditMode = true;
        this.editingMatiereId = id;
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Erreur lors du chargement de la matière';
        console.error('Erreur:', error);
      }
    });
  }

  // Supprimer une matière
  deleteMatiere(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      this.loading = true;
      this.error = '';

      this.matiereService.deleteMatiere(id).subscribe({
        next: (response) => {
          this.loading = false;
          // Supprimer la matière de la liste locale
          this.matieres = this.matieres.filter(m => m.id !== id);
          this.filteredMatieres = this.filteredMatieres.filter(m => m.id !== id);
          alert('Matière supprimée avec succès');
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Erreur lors de la suppression de la matière';
          console.error('Erreur:', error);
        }
      });
    }
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

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.matiereForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.matiereForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `Maximum ${maxLength} caractères`;
    }
    if (field.hasError('min')) {
      return 'La valeur minimum est 0.1';
    }
    if (field.hasError('max')) {
      return 'La valeur maximum est 10';
    }
    return 'Champ invalide';
  }

  // Vérifier si le formulaire peut être soumis
  canSubmit(): boolean {
    return this.matiereForm.valid && !this.loading;
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.matiereForm.valid) {
      this.loading = true;
      this.error = '';

      const matiereData = this.matiereForm.value;
      
      if (this.isEditMode && this.editingMatiereId) {
        this.matiereService.updateMatiere(this.editingMatiereId, matiereData).subscribe({
          next: (response: any) => {
            this.loading = false;
            // Mettre à jour la matière dans la liste locale
            const index = this.matieres.findIndex(m => m.id === this.editingMatiereId);
            if (index !== -1) {
              this.matieres[index] = response.matiere;
              this.filteredMatieres = this.matieres;
            }
            
            // Réinitialiser le formulaire et retourner à la liste
            this.matiereForm.reset();
            this.showAddForm = false;
            this.isEditMode = false;
            this.editingMatiereId = null;
            
            alert('Matière modifiée avec succès !');
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Erreur lors de la modification de la matière : ' + error.message;
            console.error('Erreur:', error);
          }
        });
      } else {
        this.matiereService.createMatiere(matiereData).subscribe({
          next: (response: any) => {
            this.loading = false;
            // Ajouter la nouvelle matière à la liste
            if (response.matiere) {
              this.matieres.push(response.matiere);
              this.filteredMatieres = this.matieres;
            }
            
            // Réinitialiser le formulaire et retourner à la liste
            this.matiereForm.reset();
            this.showAddForm = false;
            this.showListSection = true;
            
            alert('Matière ajoutée avec succès !');
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Erreur lors de la création de la matière : ' + error.message;
            console.error('Erreur:', error);
          }
        });
      }
    }
  }
} 