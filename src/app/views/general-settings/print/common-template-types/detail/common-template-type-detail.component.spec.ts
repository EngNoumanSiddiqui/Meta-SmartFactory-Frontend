import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTemplateTypeDetailComponent } from './common-template-type-detail.component';

describe('DetailComponent', () => {
  let component: CommonTemplateTypeDetailComponent;
  let fixture: ComponentFixture<CommonTemplateTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonTemplateTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTemplateTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
