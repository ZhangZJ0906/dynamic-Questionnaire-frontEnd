import { Component, input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-chart',
  imports: [SidebarComponent],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  id = input.required<string>();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.id);
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // 獲取 canvas 元素
    let ctx = document.getElementById('chart') as HTMLCanvasElement;
    let ctx2 = document.getElementById('chart2') as HTMLCanvasElement;
    let ctx1 = document.getElementById('chart1') as HTMLCanvasElement;

    // 設定數據
    let data = {
      // x 軸文字
      labels: ['餐費', '交通費', '租金'],
      datasets: [
        {
          // 上方分類文字
          label: '支出比',
          // 數據
          data: [12000, 3000, 9000],
          // 線與邊框顏色
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
          hoverOffset: 4,
        },
      ],
    };

    // 創建圖表
    let chart = new Chart(ctx, {
      //pie是圓餅圖,doughnut是環狀圖
      type: 'pie',
      data: data,
    });

    let chart1 = new Chart(ctx1, {
      //pie是圓餅圖,doughnut是環狀圖
      type: 'pie',
      data: data,
    });
    let chart2 = new Chart(ctx2, {
      //pie是圓餅圖,doughnut是環狀圖
      type: 'pie',
      data: data,
    });
  }
}
