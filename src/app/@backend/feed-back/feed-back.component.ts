import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

import { FeedbackVo, Survey } from './../../@interfaces/question';
import { HttpClientService } from '../../@services/httpClient.service';
import { SwalService } from '../../shared/SwalService';
import { ShowResultDialogComponent } from '../show-result-dialog/show-result-dialog.component';

@Component({
  selector: 'app-feed-back',
  imports: [
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
  feedBack: FeedbackVo[] = [];
  quizId: number | null = null;
  receivedData: any;
  displayedColumns: string[] = ['name', 'email', 'fillinDate', 'actions'];
  dataSource = new MatTableDataSource<FeedbackVo>(this.feedBack);
  startDate: Date | null = null; // 新增：開始日期變數
  endDate: Date | null = null; // 新增：結束日期變數
  constructor(
    private dialog: MatDialog,
    private http: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.receivedData = navigation?.extras.state?.['data'];
    this.quizId=this.receivedData.id;
    this.getFeedBack(this.quizId);
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // 修正 1：處理 FeedbackVo 的排序
    this.dataSource.sortingDataAccessor = (
      item: FeedbackVo,
      property: string,
    ) => {
      switch (property) {
        case 'fillinDate': // 對應 FeedbackVo 裡面的欄位
          return new Date(item.fillinDate).getTime();
        case 'name':
          return item.user?.name;
        case 'email':
          return item.user?.email;
        default:
          return (item as any)[property];
      }
    };

    // 修正 2：處理 FeedbackVo 的篩選邏輯
    this.dataSource.filterPredicate = (data: FeedbackVo, filter: string) => {
      // 1. 關鍵字篩選 (搜尋姓名或 Email)
      const searchStr = this.inputData.toLowerCase();
      const matchesSearch =
        data.user?.name.toLowerCase().includes(searchStr) ||
        data.user?.email.toLowerCase().includes(searchStr);

      // 2. 日期區間篩選 (針對填寫日期 fillinDate)
      const fillDate = new Date(data.fillinDate);
      let matchesDate = true;

      if (this.startDate && this.endDate) {
        matchesDate = fillDate >= this.startDate && fillDate <= this.endDate;
      } else if (this.startDate) {
        matchesDate = fillDate >= this.startDate;
      } else if (this.endDate) {
        matchesDate = fillDate <= this.endDate;
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
    const postData ={
      ...element,
      quizId:this.quizId,
    }
    const dialogRef = this.dialog.open(ShowResultDialogComponent, {
      width: '560px',
      height: '560px',
      data: postData,
      disableClose: false,
    });
  }

  getFeedBack(quizId: any) {
    this.http
      .getApi(this.http.basicUrl + `fillin/feed_back?quizId=${quizId}`)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200 && res.feedBackVoList) {
            this.dataSource.data = res.feedBackVoList;
          } else {
            // 只有失敗才跳出錯誤通知
            SwalService.error('獲取回饋失敗', res.message || '無法取得資料');
          }
        },
      });
  }
}
