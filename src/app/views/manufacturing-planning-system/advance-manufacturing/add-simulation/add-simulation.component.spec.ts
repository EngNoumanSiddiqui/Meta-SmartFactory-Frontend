import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSimulationComponent } from './add-simulation.component';

describe('AddSimulationComponent', () => {
  let component: AddSimulationComponent;
  let fixture: ComponentFixture<AddSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
