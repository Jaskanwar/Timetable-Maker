import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableCreateUserComponent } from './timetable-create-user.component';

describe('TimetableCreateUserComponent', () => {
  let component: TimetableCreateUserComponent;
  let fixture: ComponentFixture<TimetableCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableCreateUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
