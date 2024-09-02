import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionsFavoritesComponent } from './user-questions-favorites.component';

describe('UserQuestionsFavoritesComponent', () => {
  let component: UserQuestionsFavoritesComponent;
  let fixture: ComponentFixture<UserQuestionsFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQuestionsFavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserQuestionsFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
