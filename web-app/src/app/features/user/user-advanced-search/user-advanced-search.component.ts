import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-advanced-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './user-advanced-search.component.html',
  styleUrl: './user-advanced-search.component.css',
})
export class UserAdvancedSearchComponent {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      titleOrDescription: ['', [Validators.required, Validators.minLength(3)]], // Required validation
      topic: [''],
      category: [''],
      hasAnswers: [''],
      isSolved: [''],
    });
  }

  isValid(): boolean {
    return this.searchForm.valid;
  }

  onSearch() {
    if (this.isValid()) {
      console.log(this.searchForm.value);
    } else {
      console.log('Preencha pelo menos o título ou a descrição.');
    }
  }
}
