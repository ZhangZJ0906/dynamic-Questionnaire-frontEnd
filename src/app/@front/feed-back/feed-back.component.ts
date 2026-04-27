



import { NavComponent } from '../nav/nav.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
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
import { DialogComponent } from '../dialog/dialog.component';
import { Survey } from './../../@interfaces/question';
import { HttpClientService } from '../../@services/httpClient.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-feed-back',
  imports: [
    NavComponent,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatButton,
    MatIcon,
    RouterLink,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './feed-back.component.html',
  styleUrl: './feed-back.component.scss',
})
export class FeedBackComponent {
  inputData: string = '';
  quiz: Survey[] = [];

  displayedColumns: string[] = ['name', 'email', 'fillinDate', 'actions'];
  dataSource = new MatTableDataSource<Survey>(this.quiz);
  startDate: Date | null = null; // 新增：開始日期變數
  endDate: Date | null = null; // 新增：結束日期變數
  constructor(
    private dialog: MatDialog,
    private http: HttpClientService,
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //日期排序
    this.dataSource.sort = this.sort;
    // 日期字串要轉時間戳，排序才會正確
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'startDate':
        case 'endDate':
          return new Date(item[property]).getTime();
        default:
          return (item as any)[property];
      }
    };

    // 自定義篩選邏輯
    this.dataSource.filterPredicate = (data: Survey, filter: string) => {
      // 1. 關鍵字篩選 (原本的邏輯)
      const matchesSearch = data.title
        .toLowerCase()
        .includes(this.inputData.toLowerCase());

      // 2. 日期區間篩選
      const date = new Date(data.startDate); // 以資料的開始日期作為判斷基準
      let matchesDate = true;

      if (this.startDate && this.endDate) {
        matchesDate = date >= this.startDate && date <= this.endDate;
      } else if (this.startDate) {
        matchesDate = date >= this.startDate;
      } else if (this.endDate) {
        matchesDate = date <= this.endDate;
      }

      return matchesSearch && matchesDate;
    };
  }

  // 統一觸發篩選的方法
  applyFilter() {
    // 必須給 filter 一個值（隨便什麼字串）來觸發 filterPredicate
    this.dataSource.filter = '' + Math.random();
  }

  searchTable(event: Event) {
    this.applyFilter();
  }
  // 新增：清除按鈕功能
  resetFilters() {
    this.inputData = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilter();
  }
  //dialog
  openDialog(element: any): void {
    const id = element.id;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '560px',
      height: '560px',
      disableClose: false,
    });
  }

  getQuiz() {
    this.http
      .getApi(this.http.basicUrl + 'quiz/get_quiz_list?isFrontEnd=1')
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

          const now = new Date();
          now.setHours(0, 0, 0, 0); // 只比對日期

          const processedList = res.quizList.map((item: any) => {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);

            let currentStatus: string = '';
            if (!item.published) {
              currentStatus = '未發佈';
            } else if (now > end) {
              currentStatus = '已結束';
            } else {
              currentStatus = '進行中'; // 已發布（不管有沒有到開始日期）一律進行中
            }

            return {
              ...item,
              status: currentStatus,
              // 如果後端沒回傳數量，先給預設值 0
              questionCount: res.quizList.length ?? 0,
              responseCount: item.responseCount ?? 0,
            };
          });

          // 2. 更新類別屬性
          this.quiz = processedList;

          // 3. 重要：必須把資料塞進 dataSource 畫面才會變更
          this.dataSource.data = this.quiz;

          // 如果你有分頁或排序，建議重新指定一次（保險起見）
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  getFeedBack(quizId: any) {
    this.http
      .getApi(this.http.basicUrl + `fillin/feed_back?quizId=${quizId}`)
      .subscribe({
        next: (value) => {
          console.log(value);
        },
      });
  }
}

