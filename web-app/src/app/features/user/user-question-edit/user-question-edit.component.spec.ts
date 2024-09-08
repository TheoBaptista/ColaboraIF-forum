import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionEditComponent } from './user-question-edit.component';

describe('UserQuestionEditComponent', () => {
  let component: UserQuestionEditComponent;
  let fixture: ComponentFixture<UserQuestionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQuestionEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserQuestionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
