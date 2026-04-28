import { NavComponent } from '../nav/nav.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Survey } from './../../@interfaces/question';
import { HttpClientService } from '../../@services/httpClient.service';
import { SwalService } from '../../shared/SwalService';

@Component({
  selector: 'app-show-all',
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
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.scss',
})
export class ShowAllComponent {
  inputData: string = '';
  quiz: Survey[] = [];
  feedBackInfo: any = {};
  quizId: number[] = [];
  displayedColumns: string[] = [
    'id',
    'title',
    'startDate',
    'endDate',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Survey>(this.quiz);
  startDate: Date | null = null; // 新增：開始日期變數
  endDate: Date | null = null; // 新增：結束日期變數
  constructor(
    private http: HttpClientService,
    private route: Router,
  ) {
    this.getQuiz();
    this.isRepeat();
  }
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
  // 確認是否重複填
  isRepeat() {
    const data = localStorage.getItem('user');

    if (!data) {
      return;
    }
    const userData = JSON.parse(data);
    console.log(userData.email);
    this.http
      .getApi(this.http.basicUrl + `fillin/get_quiz_id?email=${userData.email}`)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200 && res.quizId) {
            // 1. 清空舊資料（避免重複呼叫時資料累加）
            this.quizId = [];
            // 或者更優雅的做法：直接賦值
            this.quizId = res.quizId;
          } else {
            SwalService.error('獲取失敗', res.message);
          }
        },
        error: (err) => {
          SwalService.error('獲取問卷ID失敗', err.message || '獲取問卷ID失敗');
        },
      });
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

  getQuiz() {
    this.http
      .getApi(this.http.basicUrl + 'quiz/get_quiz_list?isFrontEnd=1')
      .subscribe({
        next: (res: any) => {
          if (res.code != 200) {
            SwalService.error('獲取問卷失敗', res.message || '獲取問卷失敗');
            return;
          }

          const now = new Date();
          now.setHours(0, 0, 0, 0); // 只比對日期

          const processedList = res.quizList.map((item: any) => {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999); // 結束日當天算到最後一刻

            let currentStatus: string = '';
            if (!item.published) {
              currentStatus = '未發佈';
            } else if (now < start) {
              currentStatus = '尚未開始'; // 當前時間早於開始日期
            } else if (now > end) {
              currentStatus = '已結束'; // 當前時間晚於結束日期
            } else {
              currentStatus = '進行中'; // 介於兩者之間
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
          SwalService.error('獲取問卷失敗', err.message || '獲取問卷失敗');
        },
      });
  }

  getFeedBack(quizId: any) {
    this.http
      .getApi(this.http.basicUrl + `fillin/feed_back?quizId=${quizId}`)
      .subscribe({
        next: (value: any) => {
          this.feedBackInfo = value;
        },
      });
  }

  chart(element: any) {
    if (!element) {
      SwalService.error('參數錯誤', '參數可能錯誤');
      return;
    }
    console.log(element);
    this.route.navigate([ 'chart', element.id], {
      state: { data: element },
    });
  }
}
