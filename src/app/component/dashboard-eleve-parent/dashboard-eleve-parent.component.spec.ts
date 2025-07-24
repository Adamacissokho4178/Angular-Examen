import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEleveParentComponent } from './dashboard-eleve-parent.component';

describe('DashboardEleveParentComponent', () => {
  let component: DashboardEleveParentComponent;
  let fixture: ComponentFixture<DashboardEleveParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardEleveParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEleveParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
