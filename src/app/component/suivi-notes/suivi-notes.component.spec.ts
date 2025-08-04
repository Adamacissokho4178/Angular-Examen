import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviNotesComponent } from './suivi-notes.component';

describe('SuiviNotesComponent', () => {
  let component: SuiviNotesComponent;
  let fixture: ComponentFixture<SuiviNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuiviNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
