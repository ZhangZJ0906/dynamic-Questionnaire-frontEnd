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
import { QuizRequest, UpdateQuestionRequest } from '../../@interfaces/question';

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
  answers: { [key: number|string]: any } = {};
  question: UpdateQuestionRequest[] = [];
  quiz: QuizRequest[] = [];
  userInfo: any = {};
  constructor(
    private matdialog: MatDialog,
    private http: HttpClientService,
    private route: ActivatedRoute,
  ) {
    // 從路由快照中取得 quizId 參數 (名稱要跟 frontRoutes 定義的一樣)
    this.quizId = this.route.snapshot.paramMap.get('quizId');

    this.initUserData();
    this.getQuestion(this.quizId);
  }
  initUserData() {
    try {
      const data = localStorage.getItem("user");


      if (data) {
        this.userInfo = JSON.parse(data);


        // 自動填入 answers 物件中，這樣 HTML 就會顯示
        this.answers['name'] = this.userInfo.name || '';
        this.answers['email'] = this.userInfo.email || '';
        this.answers['phone'] = this.userInfo.phone || '';
        this.answers['age'] = this.userInfo.age || null;
      }
    } catch (e :any) {
      Swal.fire({
        title: '解析 user 資料失敗',
        text: e.message||'解析 user 資料失敗',
        icon: 'error',
      });



    }
  }
  getQuiz(id: number) {
    if (id == null || id <= 0) {
      Swal.fire({
        title: 'Id 參數錯誤',
        text: '找不到該問卷或是Id 參數錯誤',
        icon: 'error',
      });
      return;
    }
    this.http
      .getApi(this.http.basicUrl + `quiz/get_quiz_by_id?quizId=${id}`)
      .subscribe({
        next: (res: any) => {
          if (res.code != 200) {
            Swal.fire({
              title: '獲取問卷失敗',
              text: res.message || '獲取問卷失敗',
              icon: 'error',
            });
            return;
          }

          this.quiz = res.quizList;

        },
        error: (err) => {
          Swal.fire({
            title: '獲取問卷失敗',
            text: err.message || '獲取問卷失敗',
            icon: 'error',
          });
        },
      });
  }
  getQuestion(quizId: any) {
    const id = parseInt(quizId);
    this.getQuiz(id);
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

  // 處理多選題的勾選狀態
  onCheckboxChange(questionId: number, option: string, isChecked: boolean) {
    if (!this.answers[questionId]) {
      this.answers[questionId] = [];
    }

    if (isChecked) {
      this.answers[questionId].push(option);
    } else {
      const index = this.answers[questionId].indexOf(option);
      if (index > -1) {
        this.answers[questionId].splice(index, 1);
      }
    }

  }

  // 存檔
  saveToLocal() {
    localStorage.setItem(
      `quiz_${this.quizId}_cache`,
      JSON.stringify(this.answers),
    );
  }

  // 讀檔 (在 ngOnInit 或是獲取問題成功後呼叫)
  loadFromLocal() {
    const cache = localStorage.getItem(`quiz_${this.quizId}_cache`);
    if (cache) {
      this.answers = JSON.parse(cache);
    }
  }
  //TODO 秀出答案
  preview() {
    this.saveToLocal();

    this.matdialog.open(ShowPreviewComponent, {
      width: '560px',
      height: '560px',
      data: {
        question: this.question,
        answer: this.answers,
      },
    });
  }
}
