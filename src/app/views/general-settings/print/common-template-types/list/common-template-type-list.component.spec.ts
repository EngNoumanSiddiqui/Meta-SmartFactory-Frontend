import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTemplateTypeListComponent } from './common-template-type-list.component';

describe('ListComponent', () => {
  let component: CommonTemplateTypeListComponent;
  let fixture: ComponentFixture<CommonTemplateTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonTemplateTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTemplateTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
