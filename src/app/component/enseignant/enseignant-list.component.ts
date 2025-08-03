import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnseignantService, Enseignant } from '../../services/enseignant.service';
import { AuthService } from '../../services/auth.service';

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
  selectedSpecialite = '';
  filteredEnseignants: Enseignant[] = [];
  
  // Variables pour le formulaire
  showAddForm = false;
  showListSection = true;
  isEditMode = false;
  editingEnseignantId: number | null = null;
  enseignantForm: FormGroup;
  
  // Liste des spécialités
  specialites = [
    'Mathématiques',
    'Français',
    'Histoire-Géographie',
    'Sciences',
    'Anglais',
    'Espagnol',
    'Allemand',
    'Physique-Chimie',
    'SVT',
    'Éducation Physique',
    'Arts Plastiques',
    'Musique',
    'Technologie',
    'Informatique'
  ];

  constructor(
    private enseignantService: EnseignantService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.enseignantForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^[0-9+\-\s()]*$/)]],
      specialite: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Créer un admin de test si pas connecté
    if (!this.authService.isLoggedIn()) {
      this.authService.createTestAdmin();
    }
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
    let filtered = this.enseignants;

    // Filtre par terme de recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(enseignant =>
        enseignant.nom.toLowerCase().includes(term) ||
        enseignant.prenom.toLowerCase().includes(term) ||
        enseignant.specialite.toLowerCase().includes(term) ||
        enseignant.email.toLowerCase().includes(term)
      );
    }

    // Filtre par spécialité
    if (this.selectedSpecialite) {
      filtered = filtered.filter(enseignant =>
        enseignant.specialite === this.selectedSpecialite
      );
    }

    this.filteredEnseignants = filtered;
  }

  // Afficher le formulaire d'ajout
  addEnseignant(): void {
    this.showListSection = false;
    this.showAddForm = true;
    this.isEditMode = false;
    this.editingEnseignantId = null;
    this.enseignantForm.reset();
  }

  // Voir les détails d'un enseignant
  viewEnseignant(id: number): void {
    this.loading = true;
    this.error = '';
    this.enseignantService.getEnseignant(id).subscribe({
      next: (enseignant) => {
        this.loading = false;
        alert(`Détails de l'enseignant:\n\nNom: ${enseignant.nom} ${enseignant.prenom}\nSpécialité: ${enseignant.specialite}\nEmail: ${enseignant.email}\nTéléphone: ${enseignant.telephone || 'Non renseigné'}`);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Erreur lors du chargement des détails de l\'enseignant';
        console.error('Erreur:', error);
      }
    });
  }

  // Modifier un enseignant
  editEnseignant(id: number): void {
    this.loading = true;
    this.error = '';
    this.enseignantService.getEnseignant(id).subscribe({
      next: (enseignant) => {
        this.loading = false;
        this.enseignantForm.patchValue({
          nom: enseignant.nom,
          prenom: enseignant.prenom,
          email: enseignant.email,
          telephone: enseignant.telephone || '',
          specialite: enseignant.specialite
        });
        this.showAddForm = true;
        this.isEditMode = true;
        this.editingEnseignantId = id;
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Erreur lors du chargement de l\'enseignant';
        console.error('Erreur:', error);
      }
    });
  }

  // Supprimer un enseignant
  deleteEnseignant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.loading = true;
      this.error = '';
      this.enseignantService.deleteEnseignant(id).subscribe({
        next: (response) => {
          this.loading = false;
          this.enseignants = this.enseignants.filter(e => e.id !== id);
          this.filteredEnseignants = this.filteredEnseignants.filter(e => e.id !== id);
          alert('Enseignant supprimé avec succès');
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Erreur lors de la suppression de l\'enseignant';
          console.error('Erreur:', error);
        }
      });
    }
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.enseignantForm.valid) {
      this.loading = true;
      this.error = '';
      const enseignantData = this.enseignantForm.value;
      
      if (this.isEditMode && this.editingEnseignantId) {
        this.enseignantService.updateEnseignant(this.editingEnseignantId, enseignantData).subscribe({
          next: (response: any) => {
            this.loading = false;
            const index = this.enseignants.findIndex(e => e.id === this.editingEnseignantId);
            if (index !== -1) {
              this.enseignants[index] = response.enseignant;
              this.filteredEnseignants = this.enseignants;
            }
            this.enseignantForm.reset();
            this.showAddForm = false;
            this.isEditMode = false;
            this.editingEnseignantId = null;
            alert('Enseignant modifié avec succès !');
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Erreur lors de la modification de l\'enseignant : ' + error.message;
            console.error('Erreur:', error);
          }
        });
      } else {
        this.enseignantService.createEnseignant(enseignantData).subscribe({
          next: (response: any) => {
            this.loading = false;
            if (response.enseignant) {
              this.enseignants.push(response.enseignant);
              this.filteredEnseignants = this.enseignants;
            }
            this.enseignantForm.reset();
            this.showAddForm = false;
            this.showListSection = true;
            alert('Enseignant ajouté avec succès !');
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Erreur lors de la création de l\'enseignant : ' + error.message;
            console.error('Erreur:', error);
          }
        });
      }
    }
  }

  // Validation des champs
  isFieldInvalid(fieldName: string): boolean {
    const field = this.enseignantForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Messages d'erreur
  getErrorMessage(fieldName: string): string {
    const field = this.enseignantForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field.hasError('email')) {
      return 'Veuillez entrer une adresse email valide';
    }
    if (field.hasError('minlength')) {
      return `Minimum ${field.getError('minlength').requiredLength} caractères`;
    }
    if (field.hasError('maxlength')) {
      return `Maximum ${field.getError('maxlength').requiredLength} caractères`;
    }
    if (field.hasError('pattern')) {
      return 'Format invalide';
    }

    return 'Champ invalide';
  }

  // Vérifier si le formulaire peut être soumis
  canSubmit(): boolean {
    return this.enseignantForm.valid && !this.loading;
  }
} 