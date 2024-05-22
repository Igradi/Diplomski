import { Component } from '@angular/core';
import { LivePricesService } from '../../services/live-prices.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { HistoricalDataPoint } from '../../models/historicalDataPoint.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

Chart.register(...registerables);

@Component({
  selector: 'app-live-prices',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatProgressBarModule],
  templateUrl: './live-prices.component.html',
  styleUrls: ['./live-prices.component.scss']
})
export class LivePricesComponent {
  favoriteCryptosData: any[] = [];
  favoriteCryptosHistory: { [key: string]: HistoricalDataPoint[] } = {};
  isLoading = true;

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
    this.livePricesService.getFavoriteCryptosData().subscribe(
      data => {
        this.favoriteCryptosData = data.map(item => item.data);
        this.favoriteCryptosHistory = data.reduce((acc, item) => {
          acc[item.data.name] = item.history.history;
          return acc;
        }, {});
        this.updateChartData();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    );
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
      if (cryptoData.name) {
        this.historyChartData[cryptoData.name] = this.getHistoryChartData(cryptoData.name);
      }
    });
  }

  getHistoryChartData(name: string): ChartConfiguration['data'] {
    const historyData = this.favoriteCryptosHistory[name] || [];
    const historyLabels = historyData.map((point: HistoricalDataPoint) => new Date(point.date).toLocaleDateString());
    const historyPrices = historyData.map((point: HistoricalDataPoint) => point.rate);

    return {
      labels: historyLabels,
      datasets: [
        { data: historyPrices, label: `${name} Historical Price (USD)`, borderColor: '#3e95cd', fill: false }
      ]
    };
  }
}
