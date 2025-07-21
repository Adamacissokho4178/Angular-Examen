import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categorie } from '../models/categorie';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private _http: HttpClient ) { }

  private apiUrl = `${environment.apiUrl}/categories`;

  
  getCategories(): Observable<Categorie[]>{
    return this._http.get<Categorie[]>(this.apiUrl);
  }


  getCategorieById(id: number): Observable<Categorie>{
    return this._http.get<Categorie>(`${this.apiUrl}/${id}`);
  }


  addCategorie(categorie: Categorie): Observable<Categorie>{
    return this._http.post<Categorie>(this.apiUrl, categorie);
  }


  editCategorie(id: number, categorie: Categorie): Observable<Categorie>{
    return this._http.put<Categorie>(`${this.apiUrl}/${id}`, categorie);
  }

  deleteCategorie(id: number): Observable<any>{
    return this._http.delete(`${this.apiUrl}/${id}`);
  }


}
