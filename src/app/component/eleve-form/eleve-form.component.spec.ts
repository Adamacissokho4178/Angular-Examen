import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveFormComponent } from './eleve-form.component';

describe('EleveFormComponent', () => {
  let component: EleveFormComponent;
  let fixture: ComponentFixture<EleveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EleveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
