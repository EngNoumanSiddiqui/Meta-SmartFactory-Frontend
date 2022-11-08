import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationManagementComponent } from './simulation-management.component';

describe('SimulationManagementComponent', () => {
  let component: SimulationManagementComponent;
  let fixture: ComponentFixture<SimulationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
