import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityDetailComponent } from './capacity-detail.component';

describe('CapacityDetailComponent', () => {
  let component: CapacityDetailComponent;
  let fixture: ComponentFixture<CapacityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
