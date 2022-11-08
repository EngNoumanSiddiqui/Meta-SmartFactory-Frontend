import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeLangDropDownComponent } from './code-lang-drop-down.component';

describe('CodeLangDropDownComponent', () => {
  let component: CodeLangDropDownComponent;
  let fixture: ComponentFixture<CodeLangDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeLangDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeLangDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
