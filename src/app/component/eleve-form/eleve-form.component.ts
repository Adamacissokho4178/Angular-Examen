import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eleve-form',
  templateUrl: './eleve-form.component.html'
})
export class EleveFormComponent {
  eleveForm: FormGroup;
  selectedFile: File | null = null;
  identifiantGenere: string | null = null;
  messageErreur: string | null = null;

  // ✅ Propriété requise pour corriger l’erreur :
  listeClasses: string[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.eleveForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date_naissance: ['', Validators.required],
      classe_nom: ['', Validators.required]
    });

    // ✅ Appel de l'API pour charger la liste des classes
    this.http.get<any[]>('http://localhost:8000/api/classes').subscribe({
      next: (classes) => {
        this.listeClasses = classes.map(c => c.nom); // on garde juste le nom pour le menu
      },
      error: (err) => {
        console.error('Erreur chargement classes :', err);
      }
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  onSubmit() {
    this.identifiantGenere = null;
    this.messageErreur = null;

    if (this.eleveForm.invalid) return;

    const formData = new FormData();
    Object.entries(this.eleveForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.selectedFile) {
      formData.append('chemin_document', this.selectedFile);
    }

    this.http.post<any>('http://localhost:8000/api/eleves', formData).subscribe({
      next: (res) => {
        this.identifiantGenere = res.identifiant;
        alert('Inscription réussie ! Identifiant : ' + res.identifiant);
        this.eleveForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        this.messageErreur = err.error?.message || 'Erreur lors de l’enregistrement.';
        console.error(err);
      }
    });
  }
}
