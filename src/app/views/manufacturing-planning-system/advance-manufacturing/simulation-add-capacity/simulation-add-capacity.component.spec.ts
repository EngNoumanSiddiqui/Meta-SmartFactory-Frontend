import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationAddCapacityComponent } from './simulation-add-capacity.component';

describe('SimulationAddCapacityComponent', () => {
  let component: SimulationAddCapacityComponent;
  let fixture: ComponentFixture<SimulationAddCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationAddCapacityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationAddCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
