import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-answer-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './answer-dialog.component.html',
  styleUrls: ['./answer-dialog.component.css']
})
export class AnswerDialogComponent {
  answerContent = '';

  constructor(public dialogRef: MatDialogRef<AnswerDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }
  
  insertCodeSnippet() {
    const codeSnippet = '```\n// Seu código aqui\n```';
    this.answerContent += `\n${codeSnippet}`; // Adiciona o snippet de código à resposta
  }

  onSubmit(): void {
    if (this.answerContent.trim()) {
      this.dialogRef.close(this.answerContent);
    }
  }

  get isSubmitDisabled(): boolean {
    return !this.answerContent.trim();
  }
}
