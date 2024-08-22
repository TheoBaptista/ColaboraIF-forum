import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFavoritesComponent } from './question-favorites.component';

describe('QuestionFavoritesComponent', () => {
  let component: QuestionFavoritesComponent;
  let fixture: ComponentFixture<QuestionFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFavoritesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
