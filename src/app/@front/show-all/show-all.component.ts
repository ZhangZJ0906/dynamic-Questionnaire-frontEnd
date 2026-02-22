import { NavComponent } from '../nav/nav.component';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort,MatSortModule } from '@angular/material/sort';

export interface Survey {
  id: number;
  title: string;
  category: string;
  questionCount: number;
  startDate: string;
  endDate: string;
  status: '進行中' | '已結束' | '草稿';
  responseCount: number;
}
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
  ],
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.scss',
})
export class ShowAllComponent {
  inputData: string = '';
  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'questionCount',
    'startDate',
    'endDate',
    'status',
    'responseCount',
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
  // 檢查權限
  checkRole() {}

  searchTable(event: Event) {
    let keyWord = this.inputData;
    this.dataSource.filter = keyWord;
  }
  ngOnInit(): void {}
}
const SURVEY_DATA: Survey[] = [
  {
    id: 1,
    title: '2024 員工滿意度調查',
    category: '人資',
    questionCount: 20,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: '已結束',
    responseCount: 128,
  },
  {
    id: 2,
    title: '產品使用體驗問卷',
    category: '產品',
    questionCount: 15,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    status: '已結束',
    responseCount: 87,
  },
  {
    id: 3,
    title: '客戶服務品質調查',
    category: '客服',
    questionCount: 10,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: '進行中',
    responseCount: 45,
  },
  {
    id: 4,
    title: '新功能需求蒐集',
    category: '產品',
    questionCount: 8,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: '進行中',
    responseCount: 32,
  },
  {
    id: 5,
    title: '教育訓練成效評估',
    category: '人資',
    questionCount: 12,
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: '草稿',
    responseCount: 0,
  },
  {
    id: 6,
    title: '年度品牌認知度調查',
    category: '行銷',
    questionCount: 18,
    startDate: '2024-04-10',
    endDate: '2024-05-10',
    status: '草稿',
    responseCount: 0,
  },
  {
    id: 7,
    title: '辦公環境改善意見調查',
    category: '行政',
    questionCount: 9,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: '已結束',
    responseCount: 214,
  },
  {
    id: 8,
    title: '主管領導力360度評鑑',
    category: '人資',
    questionCount: 25,
    startDate: '2024-02-20',
    endDate: '2024-03-20',
    status: '已結束',
    responseCount: 76,
  },
  {
    id: 9,
    title: '市場競品分析問卷',
    category: '行銷',
    questionCount: 14,
    startDate: '2024-03-20',
    endDate: '2024-04-20',
    status: '進行中',
    responseCount: 59,
  },
  {
    id: 10,
    title: '系統操作易用性調查',
    category: '資訊',
    questionCount: 11,
    startDate: '2024-03-25',
    endDate: '2024-04-25',
    status: '進行中',
    responseCount: 23,
  },
];
