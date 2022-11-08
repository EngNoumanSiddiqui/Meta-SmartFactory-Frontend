import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCapacityComponent } from './add-capacity.component';

describe('AddCapacityComponent', () => {
  let component: AddCapacityComponent;
  let fixture: ComponentFixture<AddCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
