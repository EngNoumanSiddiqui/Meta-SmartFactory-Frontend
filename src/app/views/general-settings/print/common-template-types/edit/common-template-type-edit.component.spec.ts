import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTemplateTypeEditComponent } from './common-template-type-edit.component';

describe('EditComponent', () => {
  let component: CommonTemplateTypeEditComponent;
  let fixture: ComponentFixture<CommonTemplateTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonTemplateTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTemplateTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
