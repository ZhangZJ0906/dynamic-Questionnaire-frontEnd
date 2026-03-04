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
export interface Survey {
  id: number;
  title: string;

  questionCount: number;
  startDate: string;
  endDate: string;
  status: '進行中' | '已結束' | '草稿';
  responseCount: number;
}
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  inputData: string = '';
  constructor(
    private dialog: MatDialog,
    private route: Router,
  ) {}

  displayedColumns: string[] = [
    'id',
    'title',
    'questionCount',
    'startDate',
    'endDate',
    'status',
    'responseCount',
    'actions',
  ];
  dataSource = new MatTableDataSource<Survey>(SURVEY_DATA);

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
  }

  searchTable(event: Event) {
    let keyWord = this.inputData;
    this.dataSource.filter = keyWord;
  }

  // TODO call api 新增問卷以及reload
  showNew() {
    this.dialog.open(DialogComponent, {
      width: '560px',
      height: '560px',
      disableClose: false,
    });
  }
  checkResult(element: any) {
    const id = element.id;
    console.log(id)
    return this.route.navigate(['admin','question', 'chart', id]);
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
      //TODO call API 刪除問卷
      this.delSuccess(title);
    });
  }

  delSuccess(title: string) {
    Swal.fire({
      title: '成功',
      text: `成功刪除「${title}」`,
      icon: 'success',
    });
  }
}
const SURVEY_DATA: Survey[] = [
  {
    id: 1,
    title: '2024 員工滿意度調查',

    questionCount: 20,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: '已結束',
    responseCount: 128,
  },
  {
    id: 2,
    title: '產品使用體驗問卷',

    questionCount: 15,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    status: '已結束',
    responseCount: 87,
  },
  {
    id: 3,
    title: '客戶服務品質調查',
    questionCount: 10,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: '進行中',
    responseCount: 45,
  },
  {
    id: 4,
    title: '新功能需求蒐集',
    questionCount: 8,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: '進行中',
    responseCount: 32,
  },
  {
    id: 5,
    title: '辦公環境改善意見調查',
    questionCount: 9,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: '已結束',
    responseCount: 214,
  },
  {
    id: 6,
    title: '主管領導力360度評鑑',
    questionCount: 25,
    startDate: '2024-02-20',
    endDate: '2024-03-20',
    status: '已結束',
    responseCount: 76,
  },
  {
    id: 7,
    title: '市場競品分析問卷',
    questionCount: 14,
    startDate: '2024-03-20',
    endDate: '2024-04-20',
    status: '進行中',
    responseCount: 59,
  },
  {
    id: 8,
    title: '系統操作易用性調查',
    questionCount: 11,
    startDate: '2024-03-25',
    endDate: '2024-04-25',
    status: '進行中',
    responseCount: 23,
  },
];
