import { DialogComponent } from './../dialog/dialog.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { HttpClientService } from '../../@services/httpClient.service';
import { Survey, UpdateQuestionRequest } from '../../@interfaces/question';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { Observable } from 'rxjs';
import { SwalService } from '../../shared/SwalService';

@Component({
  selector: 'app-dashboard',
  imports: [
    SidebarComponent,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatButton,
    MatIcon,
    DialogComponent,
    MatDatepickerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  inputData: string = '';
  startDate: Date | null = null; // 新增：開始日期變數
  endDate: Date | null = null; // 新增：結束日期變
  quiz: Survey[] = [];
  questions: UpdateQuestionRequest[] = [];
  constructor(
    private dialog: MatDialog,
    private route: Router,
    private http: HttpClientService,
  ) {}

  displayedColumns: string[] = [
    'id',
    'title',
    'startDate',
    'endDate',
    'status',
    'responseCount',
    'actions',
  ];
  dataSource = new MatTableDataSource<Survey>(this.quiz);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.getQuiz();
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

  applyFilter() {
    // 必須給 filter 一個值（隨便什麼字串）來觸發 filterPredicate
    this.dataSource.filter = '' + Math.random();
  }

  searchTable(event: Event) {
    this.applyFilter();
  }

  resetFilters() {
    this.inputData = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilter();
  }

  showNew() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '560px',
      height: '560px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getQuiz();
      }
    });
  }
  //獲取 quiz 並不是 獲取 question
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

  updatePublished(id: number, published: boolean): Observable<any> {
    const postData = { id, published };
    return this.http.postApi(
      this.http.basicUrl + 'quiz/update_published',
      postData,
    );
  }
  //TODO call api 更新 published 欄位為true
  publishedQuiz(element: any) {
    const now = new Date();
    const end = new Date(element.endDate);

    const doPublish = () => {
      Swal.fire({
        title: '確定要發布嗎？',
        text: `問卷「${element.title}」確定要發布?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是的，發布！',
        cancelButtonText: '再想想',
        confirmButtonColor: '#3085d6',
        reverseButtons: true,
      }).then((res) => {
        if (!res.isConfirmed) return;

        this.updatePublished(element.id, true).subscribe({
          next: (res: any) => {
            if (res.code !== 200) {
              Swal.fire({
                title: '發布失敗',
                text: res.message,
                icon: 'error',
              });
              return; // ← 有 return，不會往下跑
            }
            Swal.fire({
              title: '成功',
              text: `已發布「${element.title}」`,
              icon: 'success',
            });
            this.getQuiz(); // ← 發布成功後刷新列表
          },
          error: (err) => {
            Swal.fire({ title: '發布失敗', text: err.message, icon: 'error' });
          },
        });
      });
    };

    if (now > end) {
      Swal.fire({
        title: '問卷已過期',
        text: '仍要發布嗎？',
        showCancelButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          doPublish();
        }
      });
      return;
    }

    doPublish();
  }

  //修改quiz的question
  editQuiz(element: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '560px',
      height: '560px',
      disableClose: false,
      data: element,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getQuiz();
      }
    });
  }

  delete(id: number) {
    if (!id || id <= 0) {
      SwalService.error(
        'ID 錯誤',
        '找不到該問卷的編號，請重新整理頁面再試一次',
      );
      return;
    }
    this.http
      .getApi(this.http.basicUrl + `quiz/delete?quizId=${id}`)
      .subscribe({
        next: (res: any) => {
          if (res.code != 200) {
            SwalService.error('刪除問卷失敗', res.message || '獲取問卷失敗');
            return;
          }
          this.getQuiz();
        },
        error: (err) => {
          SwalService.error('刪除問卷失敗', err.message || '獲取問卷失敗');
        },
      });
  }
  //GOTO　 feedback
  checkResult(element: any) {
    if (!element) {
      SwalService.error('錯誤', '參數可能為空');
      return;
    }
    this.route.navigate(['admin', 'feedback', element.id], {
      state: { data: element },
    });
  }
  //GOTO　 chart
  chart(element: any) {
    if (!element) {
      SwalService.error('參數錯誤', '參數可能錯誤');
      return;
    }
    // console.log(element)
    this.route.navigate(['admin', 'chart', element.id], {
      state: { data: element },
    });
  }
  removequestionnaire(element: any) {
    const id = element.id;
    const title = element.title;
    Swal.fire({
      title: '確定要刪除嗎？',
      text: `問卷「${element.title}」刪除後將無法恢復！`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '是的，刪除！',
      cancelButtonText: '再想想',
      confirmButtonColor: '#d33', // 刪除通常用紅色
      reverseButtons: true,
    }).then((res) => {
      if (!res.isConfirmed) {
        // ← 加上這個判斷
        return;
      }
      this.delete(id);

      Swal.fire({
        title: '成功',
        text: `成功刪除「${title}」`,
        icon: 'success',
      });
    });
  }
}
