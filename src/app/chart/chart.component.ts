import { Component, input } from '@angular/core';

import Chart from 'chart.js/auto';
import { NavComponent } from '../@front/nav/nav.component';
import { HttpClientService } from '../@services/httpClient.service';
import { Router } from '@angular/router';
import { SwalService } from '../shared/SwalService';
@Component({
  selector: 'app-chart',
  imports: [NavComponent],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  receivedData: any;
  statisticsData: any[] = []; // 儲存後端回傳的統計資料
  charts: Chart[] = []; // 儲存所有的圖表實例
  constructor(
    private http: HttpClientService,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.receivedData = navigation?.extras.state?.['data'];
    if (this.receivedData?.id) {
      this.getData(this.receivedData.id);
    } else {
      SwalService.error('錯誤', '找不到問卷編號');
    }
  }

  getData(id: number) {
    

    this.http
      .getApi(this.http.basicUrl + `fillin/statistics?quizId=${id}`)
      .subscribe({
        next: (res: any) => {
          if (res.code !== 200) {
            SwalService.error('獲取統計錯誤', res.message || '伺服器錯誤');
          }
          this.statisticsData = res.answersVos;
          setTimeout(() => this.createCharts(), 0);
        },
      });
  }

  createCharts() {
    this.statisticsData.forEach((item, index) => {
      const canvasId = `chart-${index}`;
      const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

      if (!ctx) return;

      // 統計選項出現次數
      const counts: { [key: string]: number } = {};
      item.answerList.forEach((ans: string) => {
        counts[ans] = (counts[ans] || 0) + 1;
      });

      const labels = Object.keys(counts);
      const dataValues = Object.values(counts);

      // 建立圖表
      const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              label: '投票人數',
              data: dataValues,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      this.charts.push(newChart);
    });
  }
}
