import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdvancedSearchComponent } from './user-advanced-search.component';

describe('UserAdvancedSearchComponent', () => {
  let component: UserAdvancedSearchComponent;
  let fixture: ComponentFixture<UserAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAdvancedSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
