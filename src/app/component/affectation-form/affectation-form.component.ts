import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-affectation-form',
  templateUrl: './affectation-form.component.html'
})
export class AffectationFormComponent implements OnInit {
  affectationForm: FormGroup;
  enseignants: any[] = [];
  matieres: any[] = [];
  classes: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.affectationForm = this.fb.group({
      enseignant_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      classe_nom: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8000/api/enseignants').subscribe(data => this.enseignants = data);
    this.http.get<any[]>('http://localhost:8000/api/matieres').subscribe(data => this.matieres = data);
    this.http.get<any[]>('http://localhost:8000/api/classes').subscribe(data => this.classes = data);
  }

  onSubmit() {
    if (this.affectationForm.invalid) return;
    this.http.post('http://localhost:8000/api/affectations', this.affectationForm.value)
      .subscribe({
        next: res => alert('Affectation réussie !'),
        error: err => alert('Erreur: ' + (err.error?.message || err.statusText))
      });
  }
}