import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ShowPreviewComponent } from '../show-preview/show-preview.component';
import { HttpClientService } from '../../@services/httpClient.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { UpdateQuestionRequest } from '../../@interfaces/question';

export interface questions {}
@Component({
  selector: 'app-show-question',
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIcon,
    MatRadioModule,
    MatDividerModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NavComponent,
  ],
  templateUrl: './show-question.component.html',
  styleUrl: './show-question.component.scss',
})
export class ShowQuestionComponent {
  quizId: string | null = null;
  question: UpdateQuestionRequest[] = [];
  constructor(
    private matdialog: MatDialog,
    private http: HttpClientService,
    private route: ActivatedRoute,
  ) {
    // 從路由快照中取得 quizId 參數 (名稱要跟 frontRoutes 定義的一樣)
    this.quizId = this.route.snapshot.paramMap.get('quizId');

    this.getQuestion(this.quizId);
  }

  getQuestion(quizId: any) {
    const id = parseInt(quizId);
    if (id == null || id <= 0) {
      Swal.fire({
        title: 'Id 參數錯誤',
        text: '找不到該問卷或是Id 參數錯誤',
        icon: 'error',
      });
      return;
    }
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
  //TODO 秀出答案
  preview(/*data:any*/) {
    this.matdialog.open(ShowPreviewComponent, {
      width: '560px',
      height: '560px',
      //data:data
    });
  }
}
