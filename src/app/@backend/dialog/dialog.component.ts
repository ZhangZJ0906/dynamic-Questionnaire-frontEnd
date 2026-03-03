import { Question } from './../../@interfaces/question';
import { Component, Output, EventEmitter } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'app-dialog',
  imports: [
    MatSelectModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
    MatDividerModule,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOption,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(private dialogRef: MatDialogRef<DialogComponent>) {}
  question: Question[] = [];
  onclose() {
    this.dialogRef.close();
  }

  addQuestion() {
    const newQuestion: Question = {
      label: '', // 預設空白讓使用者填
      value: '',
      questionType: 'text', // 預設題型
      required: false,
      option: [], // 初始選項為空
    };

    this.question.push(newQuestion);
  }

  // 2. 當題型切換時的處理
  onTypeChange(q: Question) {
    // 如果切換到選擇題且目前沒選項，自動加一個預設選項
    if (q.questionType !== 'text' && (!q.option || q.option.length === 0)) {
      q.option = ['選項 1'];
    }
  }

  // 3. 輔助方法：新增選項
  addOption(q: Question) {
    if (!q.option) q.option = [];
    q.option.push(`選項 ${q.option.length + 1}`);
  }

  // 4. 輔助方法：刪除選項
  removeOption(q: Question, index: number) {
    q.option?.splice(index, 1);
  }

  // 5. 輔助方法：刪除題目
  removeQuestion(index: number) {
    this.question.splice(index, 1);
  }
}
