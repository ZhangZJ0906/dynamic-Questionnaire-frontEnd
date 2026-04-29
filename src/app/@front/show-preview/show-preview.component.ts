import Swal from 'sweetalert2';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { HttpClientService } from '../../@services/httpClient.service';
import { SwalService } from '../../shared/SwalService';

@Component({
  selector: 'app-show-preview',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './show-preview.component.html',
  styleUrl: './show-preview.component.scss',
})
export class ShowPreviewComponent {
  readonly dialogRef = inject(MatDialogRef<ShowPreviewComponent>);

  constructor(
    private matdialog: MatDialog,
    private router: Router,
    private http: HttpClientService,
    @Inject(MAT_DIALOG_DATA)
    public data: { question: any[]; answer: any; userInfo: any },
  ) {}

  onCancel() {
    this.dialogRef.close();
  }
  // 輔助方法：將陣列轉為逗號分隔字串
  formatAnswer(val: any): string {
    if (Array.isArray(val)) {
      return val.join(', ');
    }
    return val || '（尚未填寫）';
  }
  sendData() {
    const answersVos = Object.keys(this.data.answer)
      .filter((key) => !isNaN(Number(key))) // 只取數字 Key (題目 ID)
      .map((key) => {
        const val = this.data.answer[key];

        // 重要：後端 AnswersVo 要的是 answerList (List<String>)
        // 所以不論是單選還是多選，都要包成陣列 [ ]
        let finalAnswerList: string[] = [];

        if (Array.isArray(val)) {
          finalAnswerList = val.map((v) => v.toString()); // 多選
        } else if (val !== null && val !== undefined) {
          finalAnswerList = [val.toString()]; // 單選或簡答，也要轉成 [ "答案" ]
        }

        return {
          questionId: parseInt(key),
          answerList: finalAnswerList, // 這裡名稱必須叫 answerList
        };
      });
    const postData = {
      answersVos: answersVos,
      email: this.data.userInfo.email,
      quizId: this.data.question[0].quizId,
    };

    // @Inject(MAT_DIALOG_DATA) public data: { question: any[]; answer: any ,userInfo:any},
    this.http
      .postApi(this.http.basicUrl + 'fillin/fillin_answer', postData)
      .subscribe({
        next: (res: any) => {
          if (res.code != 200) {
            SwalService.error(
              '填答失敗',
              res.message || '參數錯誤或是伺服器錯誤',
            );

            return;
          }
          SwalService.success('送出成功', 'success');
          this.dialogRef.close(true);
          this.router.navigate(['/showAll']);
        },
        error: (err) => {
          SwalService.error(
            '填答失敗',
            err.message || '參數錯誤或是伺服器錯誤',
          );
        },
      });
  }
  submit() {
    Swal.fire({
      title: '確定要送出？',
      text: '確定不再檢查一次嗎？', // 修正這裡：context -> text
      icon: 'question',
      showCancelButton: true, // 顯示取消按鈕
      confirmButtonText: '確定送出',
      cancelButtonText: '我再想想',
      // Material 3 风格通常使用更圆润的按钮
      confirmButtonColor: 'var(--mat-sys-primary)',
      cancelButtonColor: 'var(--mat-sys-error)',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.sendData();
    });
  }
}
