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
import { Utils } from '../../shared/utils';
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
  basicInfo!: UpdateQuizRequest;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private http: HttpClientService,
  ) {
    this.basicInfo = {
      ...data,
    };

    this.getQuestion(this.basicInfo.id);
  }

  // quiz:
  question: UpdateQuestionRequest[] = [];

  onclose() {
    this.dialogRef.close();
  }

  getQuestion(id: any) {
    this.http
      .getApi(this.http.basicUrl + `quiz/get_questions?quizId=${id}`)
      .subscribe({
        next: (res: any) => {
          if (res.code != 200) {
            Swal.fire({
              title: '獲取問題失敗',
              text: res.message || '獲取問題失敗',
              icon: 'error',
            });
            return;
          }
          console.log(res);
          this.question = res.questionVos;
        },
        error: (err) => {
          Swal.fire({
            title: '獲取問題失敗',
            text: err.message || '獲取問題失敗',
            icon: 'error',
          });
        },
      });
  }

  addQuestion() {
    const maxId =
      this.question.length > 0
        ? Math.max(...this.question.map((q) => q.questionId))
        : 0;
    const newQuestion: UpdateQuestionRequest = {
      quizId: this.basicInfo.id,
      questionId: maxId + 1,
      question: '', // 原為 label
      type: 'TEXT', // 原為 questionType，給予預設值防止 NPE
      required: false,
      optionsList: null, // 原為 option
      answerValue: '',
    };
    // console.log(this.question);

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
    //順序重排
    this.question.forEach((q, i) => {
      q.questionId = i + 1;
    });
  }

  // 5. 輔助方法：刪除題目
  removeQuestion(index: number) {
    this.question.splice(index, 1);
  }

  saveQuestion() {
    // 1. 資料清洗：確保資料結構符合後端要求
    const cleanedQuestions = this.question.map((q) => {
      return {
        ...q,
        // 如果是文字題，強迫選項為空陣列；如果是選擇題但沒選項，給予空陣列避免 null
        optionsList: q.type === 'TEXT' ? [] : q.optionsList || [],
      };
    });
    const postData = {
      quiz: {
        ...this.basicInfo,
        id: this.basicInfo.id,
        startDate: Utils.formatDate(this.basicInfo.startDate),
        endDate: Utils.formatDate(this.basicInfo.endDate),
      },
      questionVoList: cleanedQuestions,
    };

    if (!Utils.validateData(postData)) {
      return;
    }
    console.table(postData.questionVoList);
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
