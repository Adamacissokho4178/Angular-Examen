import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService, Note } from '../../services/note.service';
import { EnseignantService, Enseignant } from '../../services/enseignant.service';
import { MatiereService, Matiere } from '../../services/matiere.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  noteForm!: FormGroup;
  isEditMode = false;
  noteId: number | null = null;
  loading = false;
  error = '';
  success = '';
  submitted = false;

  // Données pour les sélecteurs
  enseignants: Enseignant[] = [];
  matieres: Matiere[] = [];
  eleves: any[] = []; // À remplacer par le service EleveService

  // Liste des périodes disponibles
  periodes = [
    'trimestre1',
    'trimestre2',
    'trimestre3',
    'semestre1',
    'semestre2',
    'annuel'
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
    private fb: FormBuilder,
    private noteService: NoteService,
    private enseignantService: EnseignantService,
    private matiereService: MatiereService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.checkEditMode();
  }

  // Initialiser le formulaire avec validation avancée
  initForm(): void {
    this.noteForm = this.fb.group({
      eleve_id: ['', [Validators.required]],
      matiere_id: ['', [Validators.required]],
      enseignant_id: ['', [Validators.required]],
      note: ['', [
        Validators.required, 
        Validators.min(0), 
        Validators.max(20),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      periode: ['', [Validators.required]],
      appreciation: ['', [
        Validators.maxLength(500),
        Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,!?;:'"()-]+$/)
      ]],
      date_evaluation: ['', [Validators.required]]
    });

    // Écouter les changements pour les calculs en temps réel
    this.noteForm.valueChanges.subscribe(() => {
      this.updateCalculs();
    });
  }

  // Charger les données nécessaires
  loadData(): void {
    this.loading = true;
    this.notificationService.loadingInfo('Chargement des données...');

    Promise.all([
      this.loadEnseignants(),
      this.loadMatieres(),
      this.loadEleves()
    ]).then(() => {
      this.loading = false;
      this.notificationService.success('Données chargées avec succès');
    }).catch(() => {
      this.loading = false;
      this.notificationService.error('Erreur lors du chargement des données');
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

  // Charger les élèves (simulation pour l'instant)
  loadEleves(): Promise<void> {
    return new Promise((resolve) => {
      // Simulation d'élèves - à remplacer par le vrai service
      this.eleves = [
        { id: 1, nom: 'Dupont', prenom: 'Jean', classe: '6ème A' },
        { id: 2, nom: 'Martin', prenom: 'Marie', classe: '6ème A' },
        { id: 3, nom: 'Bernard', prenom: 'Pierre', classe: '5ème B' },
        { id: 4, nom: 'Petit', prenom: 'Sophie', classe: '5ème B' },
        { id: 5, nom: 'Robert', prenom: 'Lucas', classe: '4ème A' }
      ];
      resolve();
    });
  }

  // Vérifier si on est en mode édition
  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.noteId = +id;
      this.loadNote(this.noteId);
    }
  }

  // Charger une note pour l'édition
  loadNote(id: number): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.noteService.getNote(id).subscribe({
      next: (note) => {
        this.noteForm.patchValue({
          eleve_id: note.eleve_id,
          matiere_id: note.matiere_id,
          enseignant_id: note.enseignant_id,
          note: note.note,
          periode: note.periode,
          appreciation: note.appreciation || '',
          date_evaluation: this.formatDateForInput(note.date_evaluation)
        });
        this.loading = false;
        this.notificationService.success('Note chargée avec succès');
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de la note';
        this.loading = false;
        this.notificationService.crudError('load', 'la note', error);
        console.error('Erreur:', error);
      }
    });
  }

  // Formater la date pour l'input
  formatDateForInput(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  // Soumettre le formulaire
  onSubmit(): void {
    this.submitted = true;
    
    if (this.noteForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const noteData: Note = {
        eleve_id: this.noteForm.value.eleve_id,
        matiere_id: this.noteForm.value.matiere_id,
        enseignant_id: this.noteForm.value.enseignant_id,
        note: parseFloat(this.noteForm.value.note),
        periode: this.noteForm.value.periode,
        appreciation: this.noteForm.value.appreciation?.trim() || null,
        date_evaluation: this.noteForm.value.date_evaluation
      };

      if (this.isEditMode && this.noteId) {
        // Mode édition
        this.noteService.updateNote(this.noteId, noteData).subscribe({
          next: (response) => {
            this.loading = false;
            this.notificationService.crudSuccess('update', 'la note');
            setTimeout(() => {
              this.router.navigate(['/notes']);
            }, 2000);
          },
          error: (error) => {
            this.loading = false;
            this.handleError(error);
          }
        });
      } else {
        // Mode création
        this.noteService.createNote(noteData).subscribe({
          next: (response) => {
            this.loading = false;
            this.notificationService.crudSuccess('create', 'la note');
            this.resetForm();
            setTimeout(() => {
              this.router.navigate(['/notes']);
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
      this.error = 'Cette note existe déjà pour cet élève et cette matière.';
    } else {
      this.error = 'Une erreur est survenue. Veuillez réessayer.';
    }
    this.notificationService.crudError(
      this.isEditMode ? 'update' : 'create', 
      'la note', 
      error
    );
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  markFormGroupTouched(): void {
    Object.keys(this.noteForm.controls).forEach(key => {
      const control = this.noteForm.get(key);
      control?.markAsTouched();
    });
  }

  // Annuler et retourner à la liste
  cancel(): void {
    this.router.navigate(['/notes']);
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.submitted = false;
    this.noteForm.reset();
    this.error = '';
    this.success = '';
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.noteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.noteForm.get(fieldName);
    
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} est obligatoire`;
    }
    
    if (field.errors['min']) {
      return `${this.getFieldLabel(fieldName)} doit être au moins ${field.errors['min'].min}`;
    }
    
    if (field.errors['max']) {
      return `${this.getFieldLabel(fieldName)} ne peut pas dépasser ${field.errors['max'].max}`;
    }
    
    if (field.errors['maxlength']) {
      return `${this.getFieldLabel(fieldName)} ne peut pas dépasser ${field.errors['maxlength'].requiredLength} caractères`;
    }
    
    if (field.errors['pattern']) {
      if (fieldName === 'note') {
        return 'La note doit être un nombre décimal valide (ex: 15.5)';
      }
      if (fieldName === 'appreciation') {
        return 'L\'appréciation contient des caractères non autorisés';
      }
    }

    return 'Champ invalide';
  }

  // Obtenir le label d'un champ
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      eleve_id: 'L\'élève',
      matiere_id: 'La matière',
      enseignant_id: 'L\'enseignant',
      note: 'La note',
      periode: 'La période',
      appreciation: 'L\'appréciation',
      date_evaluation: 'La date d\'évaluation'
    };
    return labels[fieldName] || fieldName;
  }

  // Obtenir le nom complet d'un enseignant
  getEnseignantFullName(enseignant: Enseignant): string {
    return `${enseignant.prenom} ${enseignant.nom}`;
  }

  // Obtenir le nom complet d'un élève
  getEleveFullName(eleve: any): string {
    return `${eleve.prenom} ${eleve.nom} (${eleve.classe})`;
  }

  // Obtenir la mention selon la note
  getMention(note: number): string {
    if (note >= 16) return 'Très Bien';
    if (note >= 14) return 'Bien';
    if (note >= 12) return 'Assez Bien';
    if (note >= 10) return 'Passable';
    return 'Insuffisant';
  }

  // Obtenir la classe CSS pour le badge de la note
  getNoteBadgeClass(note: number): string {
    if (note >= 16) return 'badge bg-success';
    if (note >= 14) return 'badge bg-info';
    if (note >= 12) return 'badge bg-warning';
    if (note >= 10) return 'badge bg-secondary';
    return 'badge bg-danger';
  }

  // Obtenir la classe CSS pour le badge de la période
  getPeriodeBadgeClass(periode: string): string {
    const classes: { [key: string]: string } = {
      'trimestre1': 'badge bg-primary',
      'trimestre2': 'badge bg-info',
      'trimestre3': 'badge bg-success',
      'semestre1': 'badge bg-warning',
      'semestre2': 'badge bg-danger',
      'annuel': 'badge bg-dark'
    };
    return classes[periode] || 'badge bg-secondary';
  }

  // Obtenir la classe CSS pour le badge du type d'évaluation
  getTypeEvaluationBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'Contrôle': 'badge bg-primary',
      'Devoir': 'badge bg-info',
      'Examen': 'badge bg-danger',
      'Interrogation': 'badge bg-warning',
      'Projet': 'badge bg-success',
      'Oral': 'badge bg-secondary'
    };
    return classes[type] || 'badge bg-secondary';
  }

  // Calculer la note pondérée
  getNotePonderee(): number {
    const note = this.noteForm.get('note')?.value;
    const matiereId = this.noteForm.get('matiere_id')?.value;
    
    if (note && matiereId) {
      const matiere = this.matieres.find(m => m.id === matiereId);
      const coefficient = matiere?.coefficient || 1;
      return note * coefficient;
    }
    return 0;
  }

  // Mettre à jour les calculs en temps réel
  updateCalculs(): void {
    // Cette méthode sera appelée à chaque changement du formulaire
    // pour mettre à jour les calculs en temps réel
  }

  // Valider la note en temps réel
  validateNote(): void {
    const noteControl = this.noteForm.get('note');
    if (noteControl && noteControl.value) {
      const value = parseFloat(noteControl.value);
      if (isNaN(value) || value < 0 || value > 20) {
        noteControl.setErrors({ 'invalidNote': true });
      }
    }
  }

  // Vérifier si le formulaire peut être soumis
  canSubmit(): boolean {
    return this.noteForm.valid && !this.loading;
  }

  // Obtenir le nombre de caractères pour l'appréciation
  getAppreciationCharCount(): number {
    return this.noteForm.get('appreciation')?.value?.length || 0;
  }

  // Obtenir la matière sélectionnée
  getSelectedMatiere(): Matiere | undefined {
    const matiereId = this.noteForm.get('matiere_id')?.value;
    return this.matieres.find(m => m.id === matiereId);
  }

  // Obtenir l'enseignant sélectionné
  getSelectedEnseignant(): Enseignant | undefined {
    const enseignantId = this.noteForm.get('enseignant_id')?.value;
    return this.enseignants.find(e => e.id === enseignantId);
  }

  // Obtenir l'élève sélectionné
  getSelectedEleve(): any | undefined {
    const eleveId = this.noteForm.get('eleve_id')?.value;
    return this.eleves.find(e => e.id === eleveId);
  }

  // Obtenir la date actuelle pour la validation
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
} 