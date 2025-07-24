import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private apiUrl = 'http://127.0.0.1:8000/api/eleves';

  constructor(private http: HttpClient) {}

  ajouterEleve(formData: FormData) {
    const token = localStorage.getItem('token'); // Token from login

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
