import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePlaningListComponent } from './maintenance-planing-list.component';

describe('MaintenancePlaningListComponent', () => {
  let component: MaintenancePlaningListComponent;
  let fixture: ComponentFixture<MaintenancePlaningListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenancePlaningListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePlaningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
