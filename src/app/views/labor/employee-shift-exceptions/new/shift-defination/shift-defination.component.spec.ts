import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftDefinationComponent } from './shift-defination.component';

describe('ShiftDefinationComponent', () => {
  let component: ShiftDefinationComponent;
  let fixture: ComponentFixture<ShiftDefinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftDefinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
