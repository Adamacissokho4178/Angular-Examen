import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnseignantService, Enseignant } from '../../services/enseignant.service';

@Component({
  selector: 'app-enseignant-form',
  templateUrl: './enseignant-form.component.html',
  styleUrls: ['./enseignant-form.component.css']
})
export class EnseignantFormComponent implements OnInit {
  enseignantForm!: FormGroup;
  isEditMode = false;
  enseignantId: number | null = null;
  loading = false;
  error = '';
  success = '';
  submitted = false;

  // Liste des spécialités disponibles
  specialites = [
    'Mathématiques',
    'Français',
    'Anglais',
    'Histoire-Géographie',
    'Sciences',
    'Physique-Chimie',
    'SVT',
    'Technologie',
    'Arts Plastiques',
    'Musique',
    'EPS',
    'Philosophie',
    'Économie',
    'Informatique',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  // Initialiser le formulaire avec validation avancée
  initForm(): void {
    this.enseignantForm = this.fb.group({
      nom: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
      ]],
      prenom: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(255)
      ]],
      specialite: ['', [Validators.required]],
      telephone: ['', [
        Validators.pattern(/^[0-9+\-\s()]+$/),
        Validators.maxLength(20)
      ]]
    });
  }

  // Vérifier si on est en mode édition
  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.enseignantId = +id;
      this.loadEnseignant(this.enseignantId);
    }
  }

  // Charger un enseignant pour l'édition
  loadEnseignant(id: number): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.enseignantService.getEnseignant(id).subscribe({
      next: (enseignant) => {
        this.enseignantForm.patchValue({
          nom: enseignant.nom,
          prenom: enseignant.prenom,
          email: enseignant.email,
          specialite: enseignant.specialite,
          telephone: enseignant.telephone || ''
        });
        this.loading = false;
        this.success = 'Enseignant chargé avec succès';
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de l\'enseignant';
        this.loading = false;
        console.error('Erreur:', error);
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    this.submitted = true;
    
    if (this.enseignantForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const enseignantData: Enseignant = {
        nom: this.enseignantForm.value.nom.trim(),
        prenom: this.enseignantForm.value.prenom.trim(),
        email: this.enseignantForm.value.email.trim().toLowerCase(),
        specialite: this.enseignantForm.value.specialite,
        telephone: this.enseignantForm.value.telephone?.trim() || null
      };

      if (this.isEditMode && this.enseignantId) {
        // Mode édition
        this.enseignantService.updateEnseignant(this.enseignantId, enseignantData).subscribe({
          next: (response) => {
            this.loading = false;
            this.success = 'Enseignant mis à jour avec succès !';
            setTimeout(() => {
              this.router.navigate(['/enseignants']);
            }, 2000);
          },
          error: (error) => {
            this.loading = false;
            this.handleError(error);
          }
        });
      } else {
        // Mode création
        this.enseignantService.createEnseignant(enseignantData).subscribe({
          next: (response) => {
            this.loading = false;
            this.success = 'Enseignant créé avec succès !';
            this.resetForm();
            setTimeout(() => {
              this.router.navigate(['/enseignants']);
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
      this.error = 'Veuillez corriger les erreurs dans le formulaire';
      setTimeout(() => this.error = '', 5000);
    }
  }

  // Gérer les erreurs de manière centralisée
  private handleError(error: any): void {
    if (error.error && error.error.message) {
      this.error = error.error.message;
    } else if (error.status === 422) {
      this.error = 'Données invalides. Veuillez vérifier les informations saisies.';
    } else if (error.status === 409) {
      this.error = 'Cette adresse email est déjà utilisée.';
    } else {
      this.error = 'Une erreur est survenue. Veuillez réessayer.';
    }
    setTimeout(() => this.error = '', 5000);
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  markFormGroupTouched(): void {
    Object.keys(this.enseignantForm.controls).forEach(key => {
      const control = this.enseignantForm.get(key);
      control?.markAsTouched();
    });
  }

  // Annuler et retourner à la liste
  cancel(): void {
    this.router.navigate(['/enseignants']);
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.submitted = false;
    this.enseignantForm.reset();
    this.error = '';
    this.success = '';
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.enseignantForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.enseignantForm.get(fieldName);
    
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
    
    if (field.errors['email']) {
      return 'Adresse email invalide';
    }
    
    if (field.errors['pattern']) {
      if (fieldName === 'nom' || fieldName === 'prenom') {
        return `${this.getFieldLabel(fieldName)} ne peut contenir que des lettres, espaces, tirets et apostrophes`;
      }
      if (fieldName === 'telephone') {
        return 'Format de téléphone invalide (ex: 0123456789 ou +33 1 23 45 67 89)';
      }
    }

    return 'Champ invalide';
  }

  // Obtenir le label d'un champ
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nom: 'Le nom',
      prenom: 'Le prénom',
      email: 'L\'email',
      specialite: 'La spécialité',
      telephone: 'Le téléphone'
    };
    return labels[fieldName] || fieldName;
  }

  // Valider le téléphone en temps réel
  validateTelephone(): void {
    const telephoneControl = this.enseignantForm.get('telephone');
    if (telephoneControl && telephoneControl.value) {
      const cleanPhone = telephoneControl.value.replace(/[^\d+]/g, '');
      if (cleanPhone.length < 10) {
        telephoneControl.setErrors({ 'invalidPhone': true });
      }
    }
  }

  // Vérifier si le formulaire peut être soumis
  canSubmit(): boolean {
    return this.enseignantForm.valid && !this.loading;
  }
} 