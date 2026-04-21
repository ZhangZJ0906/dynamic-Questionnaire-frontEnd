import {
  UpdateQuestionRequest,
  UpdateQuizRequest,
} from './../../@interfaces/question';
import Swal from 'sweetalert2';

import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import { HttpClientService } from '../../@services/httpClient.service';
@Component({
  selector: 'app-edit-dialog',
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
    MatSlideToggleModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent {
  // quiz: any;
  basicInfo!: UpdateQuizRequest;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private http: HttpClientService,
  ) {
    // this.quiz = { ...data };
    // this.basicInfo = {
    //   id: this.quiz.id, // 現在拿得到 ID 了
    //   title: this.quiz.title || '',
    //   description: this.quiz.description || '',
    //   startDate: this.quiz.startDate || '',
    //   endDate: this.quiz.endDate || '',
    //   published: this.quiz.published || false,
    // };
  }

  // quiz:
  question: UpdateQuestionRequest[] = [];

  onclose() {
    this.dialogRef.close();
  }

  

  addQuestion() {
    const newQuestion: UpdateQuestionRequest = {
      quizId: 1,
      questionId: this.question.length + 1,
      question: '', // 原為 label
      type: 'TEXT', // 原為 questionType，給予預設值防止 NPE
      required: false,
      optionsList: [], // 原為 option
      answerValue: '',
    };

    this.question.push(newQuestion);
  }

  // 2. 當題型切換時的處理
  onTypeChange(q: UpdateQuestionRequest) {
    // 處理前端 UI 顯示用的預設值
    if (q.type === 'MUTI') {
      q.answerValue = []; // 多選時預設為空陣列
    } else {
      q.answerValue = ''; // 單選或文字時預設為空字串
    }

    // 檢查是否為選擇題（SINGLE 或 MUTI）
    // 如果切換到選擇題且目前沒有選項，自動增加一個預設選項
    if (q.type !== 'TEXT') {
      // 判斷式改為新定義的 'TEXT'
      if (!q.optionsList || q.optionsList.length === 0) {
        // 屬性改為 optionsList
        q.optionsList = ['選項 1']; // 預設提供一個選項
      }
    } else {
      // 如果切換回填空題 (TEXT)，清空選項列表確保資料乾淨
      q.optionsList = [];
    }
  }

  // 3. 輔助方法：新增選項
  addOption(q: UpdateQuestionRequest) {
    if (!q.optionsList) q.optionsList = [];
    q.optionsList.push(`選項 ${q.optionsList.length + 1}`);
  }

  // 4. 輔助方法：刪除選項
  removeOption(q: UpdateQuestionRequest, index: number) {
    q.optionsList?.splice(index, 1);
  }

  // 5. 輔助方法：刪除題目
  removeQuestion(index: number) {
    this.question.splice(index, 1);
  }

  saveQuestion() {
    // 建立一個轉換日期的輔助函式
    const formatDate = (date: any) => {
      if (!date) return '';
      const d = new Date(date);
      // 考慮時區問題，建議使用以下方式格式化為 YYYY-MM-DD
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    };
    const postData = {
      quiz: {
        ...this.basicInfo,
        startDate: formatDate(this.basicInfo.startDate),
        endDate: formatDate(this.basicInfo.endDate),
      },
      questionVoList: this.question,
    };
    // // ✅ 正確方式 A：分開印出（最推薦，可以看到清楚的結構）
    // console.log('--- Post Data ---');
    // console.table(postData.quiz); // 表格顯示問卷基本資訊
    // console.table(postData.questionVoList); // 表格顯示題目列表
    this.http.postApi(this.http.basicUrl + 'quiz/update', postData).subscribe({
      next: (res: any) => {
        // --- 關鍵修改：檢查後端定義的自定義狀態碼 ---
        if (res.code !== 200) {
          Swal.fire({
            title: '新增失敗',
            text: res.message || '參數錯誤',
            icon: 'error',
          });
          return; // 擋掉，不執行後續登入邏輯
        }
        Swal.fire({
          title: '新增成功',
          icon: 'success',
        });

        // 關閉 dialog 並回傳資料
        this.dialogRef.close(true);
      },
      error: (err) => {
        Swal.fire({
          title: '新增失敗',
          text: err.error?.message || '伺服器連線異常',
          icon: 'error',
        });
      },
    });
  }
}
