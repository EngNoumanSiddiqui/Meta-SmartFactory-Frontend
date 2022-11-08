import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationAddShiftComponent } from './simulation-add-shift.component';

describe('SimulationAddShiftComponent', () => {
  let component: SimulationAddShiftComponent;
  let fixture: ComponentFixture<SimulationAddShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationAddShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationAddShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
