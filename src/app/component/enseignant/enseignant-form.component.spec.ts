import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnseignantFormComponent } from './enseignant-form.component';
import { EnseignantService } from '../../services/enseignant.service';

describe('EnseignantFormComponent', () => {
  let component: EnseignantFormComponent;
  let fixture: ComponentFixture<EnseignantFormComponent>;
  let enseignantService: EnseignantService;

  const mockEnseignant = {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@ecole.com',
    specialite: 'Mathématiques',
    telephone: '0123456789'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnseignantFormComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        EnseignantService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnseignantFormComponent);
    component = fixture.componentInstance;
    enseignantService = TestBed.inject(EnseignantService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    expect(component.enseignantForm).toBeDefined();
    expect(component.enseignantForm.get('nom')).toBeDefined();
    expect(component.enseignantForm.get('prenom')).toBeDefined();
    expect(component.enseignantForm.get('email')).toBeDefined();
    expect(component.enseignantForm.get('specialite')).toBeDefined();
    expect(component.enseignantForm.get('telephone')).toBeDefined();
  });

  it('should be in create mode by default', () => {
    expect(component.isEditMode).toBe(false);
    expect(component.enseignantId).toBeNull();
  });

  it('should validate required fields', () => {
    const form = component.enseignantForm;
    
    expect(form.valid).toBe(false);
    
    form.patchValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean@test.com',
      specialite: 'Mathématiques'
    });
    
    expect(form.valid).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.enseignantForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate telephone format', () => {
    const telephoneControl = component.enseignantForm.get('telephone');
    
    telephoneControl?.setValue('invalid-phone');
    expect(telephoneControl?.errors?.['pattern']).toBeTruthy();
    
    telephoneControl?.setValue('0123456789');
    expect(telephoneControl?.errors?.['pattern']).toBeFalsy();
  });

  it('should detect field invalidity correctly', () => {
    const nomControl = component.enseignantForm.get('nom');
    nomControl?.setValue('');
    nomControl?.markAsTouched();
    
    expect(component.isFieldInvalid('nom')).toBe(true);
  });

  it('should get correct error messages', () => {
    const nomControl = component.enseignantForm.get('nom');
    nomControl?.setValue('');
    nomControl?.markAsTouched();
    
    expect(component.getErrorMessage('nom')).toBe('Ce champ est obligatoire');
  });

  it('should have specialites list', () => {
    expect(component.specialites).toBeDefined();
    expect(component.specialites.length).toBeGreaterThan(0);
    expect(component.specialites).toContain('Mathématiques');
    expect(component.specialites).toContain('Français');
  });

  it('should reset form correctly', () => {
    component.enseignantForm.patchValue({
      nom: 'Test',
      prenom: 'User',
      email: 'test@test.com',
      specialite: 'Mathématiques'
    });
    
    component.resetForm();
    
    expect(component.enseignantForm.get('nom')?.value).toBe('');
    expect(component.enseignantForm.get('prenom')?.value).toBe('');
    expect(component.error).toBe('');
    expect(component.success).toBe('');
  });
}); 