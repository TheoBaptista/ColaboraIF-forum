import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionsComponent } from './user-questions.component';

describe('UserQuestionsComponent', () => {
  let component: UserQuestionsComponent;
  let fixture: ComponentFixture<UserQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQuestionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
