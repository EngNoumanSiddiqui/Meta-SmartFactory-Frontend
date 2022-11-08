import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTemplateTypeNewComponent } from './common-template-type-new.component';

describe('NewComponent', () => {
  let component: CommonTemplateTypeNewComponent;
  let fixture: ComponentFixture<CommonTemplateTypeNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonTemplateTypeNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTemplateTypeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
