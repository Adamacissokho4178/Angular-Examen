import { Component } from '@angular/core';
import  { EleveService } from '../../services/eleve.service'; // ← adapté si dossier "components"


@Component({
  selector: 'app-ajout-eleve',
  templateUrl: './ajout-eleve.component.html',
})
export class AjoutEleveComponent {
  eleve: any = {
    prenom: '',
    nom: '',
    email: '',
    date_naissance: '',
    classe_id: ''
  };
  fichier: File | null = null;

  constructor(private eleveService: EleveService) {}

  onFileChange(event: any) {
    this.fichier = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    for (const key in this.eleve) {
      formData.append(key, this.eleve[key]);
    }
    if (this.fichier) {
      formData.append('justificatif', this.fichier);
    }

    this.eleveService.ajouterEleve(formData).subscribe({
      next: (res) => {
        alert('✅ Élève ajouté avec succès !');
        console.log(res);
      },
      error: (err) => {
        alert('❌ Erreur lors de l\'ajout de l\'élève.');
        console.error(err);
      }
    });
  }
}
