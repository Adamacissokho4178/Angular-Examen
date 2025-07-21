import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produit } from '../models/produit';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private _http: HttpClient ) { }
  
  private apiUrl = `${environment.apiUrl}/produits`;

  getProduits() {
    return this._http.get<Produit[]>(`${this.apiUrl}`);
  }

  addProduct(produit: Produit):Observable<Produit>{
    return this._http.post<Produit>(`${this.apiUrl}`, produit);
  }

  updateProduct(id: number, produit: Produit): Observable<Produit>{
    return this._http.put<Produit>(`${this.apiUrl}/${id}`, produit)
  }

  getProductById(id: number): Observable<Produit>{
    return this._http.get<Produit>(`${this.apiUrl}/${id}`)
  }

  deletProduct(id: number): any{
    return this._http.delete(`${this.apiUrl}/${id}`)
  }


}
