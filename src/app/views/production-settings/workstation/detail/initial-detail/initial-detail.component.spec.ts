import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialDetailComponent } from './initial-detail.component';

describe('InitialDetailComponent', () => {
  let component: InitialDetailComponent;
  let fixture: ComponentFixture<InitialDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
