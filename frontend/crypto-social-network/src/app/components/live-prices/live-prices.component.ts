import { Component } from '@angular/core';
import { LivePricesService } from '../../services/live-prices.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { HistoricalDataPoint } from '../../models/historicalDataPoint.model';

Chart.register(...registerables);

@Component({
  selector: 'app-live-prices',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './live-prices.component.html',
  styleUrls: ['./live-prices.component.scss']
})
export class LivePricesComponent {
  favoriteCryptosData: any[] = [];
  favoriteCryptosHistory: { [key: string]: HistoricalDataPoint[] } = {};

  public lineChartData: ChartConfiguration['data'] | undefined;
  public barChartData: ChartConfiguration['data'] | undefined;
  public pieChartData: ChartConfiguration['data'] | undefined;
  public historyChartData: { [key: string]: ChartConfiguration['data'] } = {};

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public historyChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  constructor(private livePricesService: LivePricesService) { }

  ngOnInit(): void {
    this.livePricesService.getFavoriteCryptosData().subscribe(data => {
      this.favoriteCryptosData = data.map(item => item.data);
      this.favoriteCryptosHistory = data.reduce((acc, item) => {
        acc[item.data.code] = item.history.history;
        return acc;
      }, {});
      this.updateChartData();
    });
  }

  updateChartData(): void {
    const prices = this.favoriteCryptosData.map(crypto => crypto.rate);
    const marketCaps = this.favoriteCryptosData.map(crypto => crypto.cap);
    const volumes = this.favoriteCryptosData.map(crypto => crypto.volume);
    const labels = this.favoriteCryptosData.map(crypto => crypto.name);

    this.lineChartData = {
      labels: labels,
      datasets: [
        { data: prices, label: 'Price (USD)', borderColor: '#3e95cd', fill: false }
      ]
    };

    this.barChartData = {
      labels: labels,
      datasets: [
        { data: marketCaps, label: 'Market Cap (USD)', backgroundColor: '#8e5ea2' }
      ]
    };

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: volumes,
          backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
          label: 'Volume (USD)'
        }
      ]
    };

    this.favoriteCryptosData.forEach(cryptoData => {
      this.historyChartData[cryptoData.code] = this.getHistoryChartData(cryptoData.code);
    });
  }

  getHistoryChartData(code: string): ChartConfiguration['data'] {
    const historyData = this.favoriteCryptosHistory[code] || [];
    const historyLabels = historyData.map((point: HistoricalDataPoint) => new Date(point.date).toLocaleDateString());
    const historyPrices = historyData.map((point: HistoricalDataPoint) => point.rate);

    return {
      labels: historyLabels,
      datasets: [
        { data: historyPrices, label: `${code} Historical Price (USD)`, borderColor: '#3e95cd', fill: false }
      ]
    };
  }
}
