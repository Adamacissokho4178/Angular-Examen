import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseService, Classe } from '../../../services/classe.service';

@Component({
  selector: 'app-classe-form',
  templateUrl: './classe-form.component.html',
  styleUrls: ['./classe-form.component.css']
})
export class ClasseFormComponent implements OnInit {
  classeForm: FormGroup;
  isEditMode = false;
  classeId: number | null = null;
  loading = false;
  error = '';
  success = '';

  niveaux = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.classeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      niveau: ['', Validators.required],
      capacite: [30, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.classeId = +params['id'];
        this.loadClasse(this.classeId);
      }
    });
  }

  loadClasse(id: number): void {
    this.loading = true;
    this.classeService.getClasse(id).subscribe({
      next: (classe) => {
        this.classeForm.patchValue({
          nom: classe.nom,
          niveau: classe.niveau,
          capacite: classe.capacite || 30
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la classe';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.classeForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const classeData: Classe = this.classeForm.value;

      if (this.isEditMode && this.classeId) {
        this.classeService.updateClasse(this.classeId, classeData).subscribe({
          next: () => {
            this.success = 'Classe mise à jour avec succès !';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/classes']);
            }, 2000);
          },
          error: (err) => {
            this.error = 'Erreur lors de la mise à jour de la classe';
            this.loading = false;
            console.error('Erreur:', err);
          }
        });
      } else {
        this.classeService.createClasse(classeData).subscribe({
          next: () => {
            this.success = 'Classe créée avec succès !';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/classes']);
            }, 2000);
          },
          error: (err) => {
            this.error = 'Erreur lors de la création de la classe';
            this.loading = false;
            console.error('Erreur:', err);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.classeForm.controls).forEach(key => {
      const control = this.classeForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/classes']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.classeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} est requis`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} doit être supérieur à ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldLabel(fieldName)} doit être inférieur à ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nom: 'Le nom',
      niveau: 'Le niveau',
      capacite: 'La capacité'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.classeForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
