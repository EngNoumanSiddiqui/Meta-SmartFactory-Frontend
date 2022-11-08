import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDefinationComponent } from './group-defination.component';

describe('GroupDefinationComponent', () => {
  let component: GroupDefinationComponent;
  let fixture: ComponentFixture<GroupDefinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDefinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
