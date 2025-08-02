import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatiereListComponent } from './matiere-list.component';
import { MatiereService } from '../../services/matiere.service';

describe('MatiereListComponent', () => {
  let component: MatiereListComponent;
  let fixture: ComponentFixture<MatiereListComponent>;
  let matiereService: MatiereService;

  const mockMatieres = [
    {
      id: 1,
      nom: 'Mathématiques',
      niveau: '6ème',
      coefficient: 4,
      description: 'Mathématiques de base'
    },
    {
      id: 2,
      nom: 'Français',
      niveau: '5ème',
      coefficient: 3,
      description: 'Langue française'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatiereListComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [ MatiereService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatiereListComponent);
    component = fixture.componentInstance;
    matiereService = TestBed.inject(MatiereService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load matieres on init', () => {
    spyOn(component, 'loadMatieres');
    component.ngOnInit();
    expect(component.loadMatieres).toHaveBeenCalled();
  });

  it('should filter matieres by search term', () => {
    component.matieres = mockMatieres;
    
    component.searchTerm = 'Mathématiques';
    component.searchMatieres();
    
    expect(component.filteredMatieres.length).toBe(1);
    expect(component.filteredMatieres[0].nom).toBe('Mathématiques');
  });

  it('should filter matieres by niveau', () => {
    component.matieres = mockMatieres;
    
    component.selectedNiveau = '6ème';
    component.searchMatieres();
    
    expect(component.filteredMatieres.length).toBe(1);
    expect(component.filteredMatieres[0].niveau).toBe('6ème');
  });

  it('should reset filters correctly', () => {
    component.searchTerm = 'test';
    component.selectedNiveau = '6ème';
    component.filteredMatieres = [];
    component.matieres = mockMatieres;
    
    component.resetFilters();
    
    expect(component.searchTerm).toBe('');
    expect(component.selectedNiveau).toBe('');
    expect(component.filteredMatieres).toEqual(component.matieres);
  });

  it('should get correct niveau badge class', () => {
    expect(component.getNiveauBadgeClass('6ème')).toBe('bg-primary');
    expect(component.getNiveauBadgeClass('5ème')).toBe('bg-success');
    expect(component.getNiveauBadgeClass('4ème')).toBe('bg-info');
    expect(component.getNiveauBadgeClass('3ème')).toBe('bg-warning');
    expect(component.getNiveauBadgeClass('2nde')).toBe('bg-secondary');
    expect(component.getNiveauBadgeClass('1ère')).toBe('bg-danger');
    expect(component.getNiveauBadgeClass('Terminale')).toBe('bg-dark');
  });

  it('should get correct coefficient badge class', () => {
    expect(component.getCoefficientBadgeClass(5)).toBe('bg-danger');
    expect(component.getCoefficientBadgeClass(3)).toBe('bg-warning');
    expect(component.getCoefficientBadgeClass(1)).toBe('bg-success');
    expect(component.getCoefficientBadgeClass(0.5)).toBe('bg-secondary');
  });

  it('should check if matiere has description', () => {
    const matiereWithDesc = { id: 1, nom: 'Test', niveau: '6ème', coefficient: 1, description: 'Description' };
    const matiereWithoutDesc = { id: 2, nom: 'Test2', niveau: '5ème', coefficient: 1 };
    
    expect(component.hasDescription(matiereWithDesc)).toBe(true);
    expect(component.hasDescription(matiereWithoutDesc)).toBe(false);
  });

  it('should get description preview correctly', () => {
    const shortDesc = 'Short description';
    const longDesc = 'This is a very long description that should be truncated to show only the first 50 characters';
    
    expect(component.getDescriptionPreview(shortDesc)).toBe(shortDesc);
    expect(component.getDescriptionPreview(longDesc)).toBe('This is a very long description that should be truncate...');
  });

  it('should sort matieres by name', () => {
    component.filteredMatieres = [
      { id: 2, nom: 'Français', niveau: '5ème', coefficient: 3 },
      { id: 1, nom: 'Mathématiques', niveau: '6ème', coefficient: 4 }
    ];
    
    component.sortByName();
    
    expect(component.filteredMatieres[0].nom).toBe('Français');
    expect(component.filteredMatieres[1].nom).toBe('Mathématiques');
  });

  it('should sort matieres by niveau', () => {
    component.filteredMatieres = [
      { id: 2, nom: 'Français', niveau: '5ème', coefficient: 3 },
      { id: 1, nom: 'Mathématiques', niveau: '6ème', coefficient: 4 }
    ];
    
    component.sortByNiveau();
    
    expect(component.filteredMatieres[0].niveau).toBe('5ème');
    expect(component.filteredMatieres[1].niveau).toBe('6ème');
  });

  it('should sort matieres by coefficient', () => {
    component.filteredMatieres = [
      { id: 2, nom: 'Français', niveau: '5ème', coefficient: 3 },
      { id: 1, nom: 'Mathématiques', niveau: '6ème', coefficient: 4 }
    ];
    
    component.sortByCoefficient();
    
    expect(component.filteredMatieres[0].coefficient).toBe(4);
    expect(component.filteredMatieres[1].coefficient).toBe(3);
  });

  it('should get correct stats', () => {
    component.filteredMatieres = mockMatieres;
    
    const stats = component.getStats();
    
    expect(stats.total).toBe(2);
    expect(stats.byNiveau['6ème']).toBe(1);
    expect(stats.byNiveau['5ème']).toBe(1);
    expect(stats.avgCoefficient).toBe(3.5);
  });

  it('should have niveaux list', () => {
    expect(component.niveaux).toBeDefined();
    expect(component.niveaux.length).toBe(7);
    expect(component.niveaux).toContain('6ème');
    expect(component.niveaux).toContain('Terminale');
  });
}); 