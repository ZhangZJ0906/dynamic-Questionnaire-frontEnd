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
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientService } from '../../@services/httpClient.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SwalService } from '../../shared/SwalService';
import { QuizRequest } from '../../@interfaces/question';
@Component({
  selector: 'app-show-result-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    SidebarComponent,
  ],
  templateUrl: './show-result-dialog.component.html',
  styleUrl: './show-result-dialog.component.scss',
})
export class ShowResultDialogComponent {
  readOnlyAnswer: any;
  quiz: QuizRequest[] = [];
  constructor(
    private http: HttpClientService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.readOnlyAnswer = this.data;
    this.getQuiz(this.readOnlyAnswer.quizId)
    
    
    console.log(this.readOnlyAnswer);
  }
  readonly dialogRef = inject(MatDialogRef<ShowResultDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
  getQuiz(id: number) {
    if (id == null || id <= 0) {
      SwalService.error('Id 參數錯誤', '找不到該問卷或是Id 參數錯誤');
      return;
    }
    this.http
      .getApi(this.http.basicUrl + `quiz/get_quiz_by_id?quizId=${id}`)
      .subscribe({
        next: (res: any) => {
          if (res.code != 200) {
            SwalService.error('獲取問卷失敗', res.message || '獲取問卷失敗');
            return;
          }

          this.quiz = res.quizList;
          console.log(this.quiz)
        },
        error: (err) => {
          SwalService.error('獲取問卷失敗', err.message || '獲取問卷失敗');
        },
      });
  }
}
