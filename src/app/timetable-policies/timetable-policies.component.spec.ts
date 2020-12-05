import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetablePoliciesComponent } from './timetable-policies.component';

describe('TimetablePoliciesComponent', () => {
  let component: TimetablePoliciesComponent;
  let fixture: ComponentFixture<TimetablePoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetablePoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetablePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
