import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AffectationService, Affectation } from '../../services/affectation.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';
import { ClasseService } from '../../services/classe.service';
import { AuthService } from '../../services/auth.service';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.css']
})
export class AffectationComponent implements OnInit {
  affectations: Affectation[] = [];
  enseignants: any[] = [];
  matieres: any[] = [];
  classes: any[] = [];
  
  showAddForm = false;
  isEditMode = false;
  editingAffectationId: number | null = null;
  
  affectationForm: FormGroup;
  isLoading = false;
  
  searchTerm = '';
  selectedEnseignant = '';
  selectedMatiere = '';
  selectedClasse = '';

  constructor(
    private affectationService: AffectationService,
    private enseignantService: EnseignantService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    private authService: AuthService,
    private noteService: NoteService,
    private fb: FormBuilder
  ) {
    this.affectationForm = this.fb.group({
      enseignant_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      classe_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Créer un admin de test si pas connecté
    if (!this.authService.isLoggedIn()) {
      this.authService.createTestAdmin();
    }
    
    this.loadAffectations();
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.noteService.getDropdownData().subscribe({
      next: (data) => {
        this.enseignants = data.enseignants || [];
        this.matieres = data.matieres || [];
        this.classes = data.classes || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données des listes déroulantes:', error);
      }
    });
  }

  loadAffectations(): void {
    this.isLoading = true;
    this.affectationService.getAffectations().subscribe({
      next: (data) => {
        this.affectations = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des affectations:', error);
        this.isLoading = false;
      }
    });
  }

  loadEnseignants(): void {
    this.enseignantService.getEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des enseignants:', error);
      }
    });
  }

  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe({
      next: (data) => {
        this.matieres = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matières:', error);
      }
    });
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des classes:', error);
      }
    });
  }

  addAffectation(): void {
    this.showAddForm = true;
    this.isEditMode = false;
    this.editingAffectationId = null;
    this.affectationForm.reset();
  }

  editAffectation(id: number): void {
    this.affectationService.getAffectation(id).subscribe({
      next: (affectation) => {
        this.affectationForm.patchValue({
          enseignant_id: affectation.enseignant_id,
          matiere_id: affectation.matiere_id,
          classe_id: affectation.classe_id
        });
        this.showAddForm = true;
        this.isEditMode = true;
        this.editingAffectationId = id;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'affectation:', error);
        alert('Erreur lors du chargement de l\'affectation');
      }
    });
  }

  deleteAffectation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) {
      this.affectationService.deleteAffectation(id).subscribe({
        next: () => {
          this.affectations = this.affectations.filter(a => a.id !== id);
          alert('Affectation supprimée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  viewAffectation(id: number): void {
    this.affectationService.getAffectation(id).subscribe({
      next: (affectation) => {
        const details = `
          Enseignant: ${affectation.enseignant?.nom} ${affectation.enseignant?.prenom}
          Matière: ${affectation.matiere?.nom}
          Classe: ${affectation.classe?.nom}
          Créée le: ${new Date(affectation.created_at || '').toLocaleDateString()}
        `;
        alert(details);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        alert('Erreur lors du chargement des détails');
      }
    });
  }

  onSubmit(): void {
    if (this.affectationForm.valid) {
      const affectationData = this.affectationForm.value;
      
      if (this.isEditMode && this.editingAffectationId) {
        this.affectationService.updateAffectation(this.editingAffectationId, affectationData).subscribe({
          next: (response) => {
            this.loadAffectations();
            this.showAddForm = false;
            this.isEditMode = false;
            this.editingAffectationId = null;
            alert('Affectation modifiée avec succès');
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            alert('Erreur lors de la modification');
          }
        });
      } else {
        this.affectationService.createAffectation(affectationData).subscribe({
          next: (response) => {
            this.loadAffectations();
            this.showAddForm = false;
            this.affectationForm.reset();
            alert('Affectation créée avec succès');
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            alert('Erreur lors de la création');
          }
        });
      }
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditMode = false;
    this.editingAffectationId = null;
    this.affectationForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.affectationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.affectationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
    }
    return '';
  }

  canSubmit(): boolean {
    return this.affectationForm.valid;
  }

  searchAffectations(): void {
    // Filtrage côté client pour l'instant
    // Plus tard, on peut implémenter le filtrage côté serveur
  }

  getFilteredAffectations(): Affectation[] {
    return this.affectations.filter(affectation => {
      const enseignant = affectation.enseignant;
      const matiere = affectation.matiere;
      const classe = affectation.classe;
      
      const matchesSearch = !this.searchTerm || 
        (enseignant && (enseignant.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                       enseignant.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()))) ||
        (matiere && matiere.nom?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (classe && classe.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesEnseignant = !this.selectedEnseignant || 
        affectation.enseignant_id.toString() === this.selectedEnseignant;
      
      const matchesMatiere = !this.selectedMatiere || 
        affectation.matiere_id.toString() === this.selectedMatiere;
      
      const matchesClasse = !this.selectedClasse || 
        affectation.classe_id.toString() === this.selectedClasse;
      
      return matchesSearch && matchesEnseignant && matchesMatiere && matchesClasse;
    });
  }
}
