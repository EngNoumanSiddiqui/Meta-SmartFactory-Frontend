import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupDefinationComponent } from './edit-group-defination.component';

describe('EditGroupDefinationComponent', () => {
  let component: EditGroupDefinationComponent;
  let fixture: ComponentFixture<EditGroupDefinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupDefinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
