/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ByAllComponent } from './by-all.component';

describe('ByAllComponent', () => {
  let component: ByAllComponent;
  let fixture: ComponentFixture<ByAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
