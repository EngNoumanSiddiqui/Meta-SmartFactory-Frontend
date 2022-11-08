import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePlaningDetailComponent } from './maintenance-planing-detail.component';

describe('MaintenancePlaningDetailComponent', () => {
  let component: MaintenancePlaningDetailComponent;
  let fixture: ComponentFixture<MaintenancePlaningDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenancePlaningDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePlaningDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
