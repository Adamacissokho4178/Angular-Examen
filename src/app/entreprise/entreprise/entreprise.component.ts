import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrl: './entreprise.component.css'
})
export class EntrepriseComponent implements OnInit{

  constructor(private httpClient :HttpClient ){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getAll() : void{
    this.httpClient.get("http://127.0.0.1:8000/api/entreprise").subscribe(
    
    )
  }

}
