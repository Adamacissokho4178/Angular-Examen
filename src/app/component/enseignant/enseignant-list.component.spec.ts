import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EnseignantListComponent } from './enseignant-list.component';
import { EnseignantService } from '../../services/enseignant.service';

describe('EnseignantListComponent', () => {
  let component: EnseignantListComponent;
  let fixture: ComponentFixture<EnseignantListComponent>;
  let enseignantService: EnseignantService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnseignantListComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [ EnseignantService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnseignantListComponent);
    component = fixture.componentInstance;
    enseignantService = TestBed.inject(EnseignantService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load enseignants on init', () => {
    spyOn(component, 'loadEnseignants');
    component.ngOnInit();
    expect(component.loadEnseignants).toHaveBeenCalled();
  });

  it('should filter enseignants by search term', () => {
    component.enseignants = [
      { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', specialite: 'Mathématiques' },
      { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie@test.com', specialite: 'Français' }
    ];
    
    component.searchTerm = 'Jean';
    component.searchEnseignants();
    
    expect(component.filteredEnseignants.length).toBe(1);
    expect(component.filteredEnseignants[0].prenom).toBe('Jean');
  });

  it('should get full name correctly', () => {
    const enseignant = { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', specialite: 'Mathématiques' };
    const fullName = component.getFullName(enseignant);
    expect(fullName).toBe('Jean Dupont');
  });

  it('should check if enseignant has telephone', () => {
    const enseignantWithPhone = { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', specialite: 'Mathématiques', telephone: '0123456789' };
    const enseignantWithoutPhone = { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie@test.com', specialite: 'Français' };
    
    expect(component.hasTelephone(enseignantWithPhone)).toBe(true);
    expect(component.hasTelephone(enseignantWithoutPhone)).toBe(false);
  });

  it('should reset search correctly', () => {
    component.searchTerm = 'test';
    component.filteredEnseignants = [];
    component.enseignants = [{ id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', specialite: 'Mathématiques' }];
    
    component.resetSearch();
    
    expect(component.searchTerm).toBe('');
    expect(component.filteredEnseignants).toEqual(component.enseignants);
  });
}); 