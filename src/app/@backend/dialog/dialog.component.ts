import { Question, QuizRequest } from './../../@interfaces/question';
import { Component } from '@angular/core';
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
import { SwalService } from '../../shared/SwalService';
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
    MatSlideToggleModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private http: HttpClientService,
  ) {}
  today: Date = new Date(); // ← 加這行
  question: Question[] = [];
  basicInfo: QuizRequest = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    published: false, // 補上後端需要的欄位
  };
  onclose() {
    this.dialogRef.close();
  }

  addQuestion() {
    const newQuestion: Question = {
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
  onTypeChange(q: Question) {
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
  addOption(q: Question) {
    if (!q.optionsList) q.optionsList = [];
    q.optionsList.push(`選項 ${q.optionsList.length + 1}`);
  }

  // 4. 輔助方法：刪除選項
  removeOption(q: Question, index: number) {
    q.optionsList?.splice(index, 1);
  }

  // 5. 輔助方法：刪除題目
  removeQuestion(index: number) {
    this.question.splice(index, 1);
  }

  saveQuestion() {
    const postData = {
      quiz: {
        ...this.basicInfo,
        startDate: Utils.formatDate(this.basicInfo.startDate),
        endDate: Utils.formatDate(this.basicInfo.endDate),
      },
      questionVoList: this.question,
    };
    if (!Utils.validateData(postData)) {
      return;
    }

    this.http.postApi(this.http.basicUrl + 'quiz/create', postData).subscribe({
      next: (res: any) => {
        // --- 關鍵修改：檢查後端定義的自定義狀態碼 ---
        if (res.code !== 200) {
          SwalService.error('新增失敗', res.message || '參數錯誤');

          return; // 擋掉，不執行後續登入邏輯
        }
        SwalService.success("新增成功","success")
        // 關閉 dialog 並回傳資料
        this.dialogRef.close(true);
      },
      error: (err) => {
          SwalService.error('新增失敗', err.error?.message || '伺服器連線異常');
      },
    });
  }
}
