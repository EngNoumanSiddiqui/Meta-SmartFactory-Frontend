import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicScreenComponent } from './basic-screen.component';

describe('BasicScreenComponent', () => {
  let component: BasicScreenComponent;
  let fixture: ComponentFixture<BasicScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
