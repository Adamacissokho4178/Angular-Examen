import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatiereService, Matiere } from '../../services/matiere.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-matiere-form',
  templateUrl: './matiere-form.component.html',
  styleUrls: ['./matiere-form.component.css']
})
export class MatiereFormComponent implements OnInit {
  matiereForm!: FormGroup;
  isEditMode = false;
  matiereId: number | null = null;
  loading = false;
  error = '';
  success = '';
  submitted = false;

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

  // Coefficients prédéfinis
  coefficients = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  // Initialiser le formulaire avec validation avancée
  initForm(): void {
    this.matiereForm = this.fb.group({
      nom: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
      ]],
      niveau: ['', [Validators.required]],
      coefficient: [1, [
        Validators.required, 
        Validators.min(0.1), 
        Validators.max(10),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      description: ['', [
        Validators.maxLength(1000),
        Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,!?;:'"()-]+$/)
      ]]
    });
  }

  // Vérifier si on est en mode édition
  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.matiereId = +id;
      this.loadMatiere(this.matiereId);
    }
  }

  // Charger une matière pour l'édition
  loadMatiere(id: number): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.matiereService.getMatiere(id).subscribe({
      next: (matiere) => {
        this.matiereForm.patchValue({
          nom: matiere.nom,
          niveau: matiere.niveau,
          coefficient: matiere.coefficient,
          description: matiere.description || ''
        });
        this.loading = false;
        this.notificationService.success('Matière chargée avec succès');
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de la matière';
        this.loading = false;
        this.notificationService.crudError('load', 'la matière', error);
        console.error('Erreur:', error);
      }
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    this.submitted = true;
    
    if (this.matiereForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const matiereData: Matiere = {
        nom: this.matiereForm.value.nom.trim(),
        niveau: this.matiereForm.value.niveau,
        coefficient: parseFloat(this.matiereForm.value.coefficient),
        description: this.matiereForm.value.description?.trim() || null
      };

      if (this.isEditMode && this.matiereId) {
        // Mode édition
        this.matiereService.updateMatiere(this.matiereId, matiereData).subscribe({
          next: (response) => {
            this.loading = false;
            this.notificationService.crudSuccess('update', 'la matière');
            setTimeout(() => {
              this.router.navigate(['/matieres']);
            }, 2000);
          },
          error: (error) => {
            this.loading = false;
            this.handleError(error);
          }
        });
      } else {
        // Mode création
        this.matiereService.createMatiere(matiereData).subscribe({
          next: (response) => {
            this.loading = false;
            this.notificationService.crudSuccess('create', 'la matière');
            this.resetForm();
            setTimeout(() => {
              this.router.navigate(['/matieres']);
            }, 2000);
          },
          error: (error) => {
            this.loading = false;
            this.handleError(error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
      this.notificationService.validationError('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  // Gérer les erreurs de manière centralisée
  private handleError(error: any): void {
    if (error.error && error.error.message) {
      this.error = error.error.message;
    } else if (error.status === 422) {
      this.error = 'Données invalides. Veuillez vérifier les informations saisies.';
    } else if (error.status === 409) {
      this.error = 'Cette matière existe déjà.';
    } else {
      this.error = 'Une erreur est survenue. Veuillez réessayer.';
    }
    this.notificationService.crudError(
      this.isEditMode ? 'update' : 'create', 
      'la matière', 
      error
    );
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  markFormGroupTouched(): void {
    Object.keys(this.matiereForm.controls).forEach(key => {
      const control = this.matiereForm.get(key);
      control?.markAsTouched();
    });
  }

  // Annuler et retourner à la liste
  cancel(): void {
    this.router.navigate(['/matieres']);
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.submitted = false;
    this.matiereForm.reset({
      coefficient: 1
    });
    this.error = '';
    this.success = '';
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.matiereForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.matiereForm.get(fieldName);
    
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} est obligatoire`;
    }
    
    if (field.errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
    }
    
    if (field.errors['maxlength']) {
      return `${this.getFieldLabel(fieldName)} ne peut pas dépasser ${field.errors['maxlength'].requiredLength} caractères`;
    }
    
    if (field.errors['min']) {
      return `${this.getFieldLabel(fieldName)} doit être au moins ${field.errors['min'].min}`;
    }
    
    if (field.errors['max']) {
      return `${this.getFieldLabel(fieldName)} ne peut pas dépasser ${field.errors['max'].max}`;
    }
    
    if (field.errors['pattern']) {
      if (fieldName === 'nom') {
        return `${this.getFieldLabel(fieldName)} ne peut contenir que des lettres, espaces, tirets et apostrophes`;
      }
      if (fieldName === 'coefficient') {
        return 'Le coefficient doit être un nombre décimal valide (ex: 1.5)';
      }
      if (fieldName === 'description') {
        return 'La description contient des caractères non autorisés';
      }
    }

    return 'Champ invalide';
  }

  // Obtenir le label d'un champ
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nom: 'Le nom de la matière',
      niveau: 'Le niveau',
      coefficient: 'Le coefficient',
      description: 'La description'
    };
    return labels[fieldName] || fieldName;
  }

  // Valider le coefficient en temps réel
  validateCoefficient(): void {
    const coefficientControl = this.matiereForm.get('coefficient');
    if (coefficientControl && coefficientControl.value) {
      const value = parseFloat(coefficientControl.value);
      if (isNaN(value) || value < 0.1 || value > 10) {
        coefficientControl.setErrors({ 'invalidCoefficient': true });
      }
    }
  }

  // Obtenir la classe CSS pour le badge du coefficient
  getCoefficientBadgeClass(coefficient: number): string {
    if (coefficient >= 3) return 'badge bg-danger';
    if (coefficient >= 2) return 'badge bg-warning';
    if (coefficient >= 1.5) return 'badge bg-info';
    return 'badge bg-success';
  }

  // Obtenir la classe CSS pour le badge du niveau
  getNiveauBadgeClass(niveau: string): string {
    const classes: { [key: string]: string } = {
      '6ème': 'badge bg-primary',
      '5ème': 'badge bg-primary',
      '4ème': 'badge bg-info',
      '3ème': 'badge bg-info',
      '2nde': 'badge bg-warning',
      '1ère': 'badge bg-warning',
      'Terminale': 'badge bg-danger'
    };
    return classes[niveau] || 'badge bg-secondary';
  }

  // Vérifier si le formulaire peut être soumis
  canSubmit(): boolean {
    return this.matiereForm.valid && !this.loading;
  }

  // Obtenir le nombre de caractères pour la description
  getDescriptionCharCount(): number {
    return this.matiereForm.get('description')?.value?.length || 0;
  }
} 