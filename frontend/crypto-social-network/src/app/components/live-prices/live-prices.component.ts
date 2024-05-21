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
      console.log('Raw API data:', data);
      this.favoriteCryptosData = data.map(item => item.data);
      this.favoriteCryptosHistory = data.reduce((acc, item) => {
        acc[item.data.name] = item.history.history;
        return acc;
      }, {});
      console.log('Favorite Cryptos Data:', this.favoriteCryptosData);
      console.log('Favorite Cryptos History:', this.favoriteCryptosHistory);
      this.updateChartData();
    });
  }

  updateChartData(): void {
    const prices = this.favoriteCryptosData.map(crypto => crypto.rate);
    const marketCaps = this.favoriteCryptosData.map(crypto => crypto.cap);
    const volumes = this.favoriteCryptosData.map(crypto => crypto.volume);
    const labels = this.favoriteCryptosData.map(crypto => crypto.name);

    console.log('Prices:', prices);
    console.log('Market Caps:', marketCaps);
    console.log('Volumes:', volumes);
    console.log('Labels:', labels);

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
      console.log('Processing crypto data:', cryptoData);
      if (cryptoData.name) {
        console.log(`Updating historical data for ${cryptoData.name}`);
        this.historyChartData[cryptoData.name] = this.getHistoryChartData(cryptoData.name);
      } else {
        console.error('cryptoData.name is undefined:', cryptoData);
      }
    });

    console.log('History Chart Data:', this.historyChartData);
  }

  getHistoryChartData(name: string): ChartConfiguration['data'] {
    const historyData = this.favoriteCryptosHistory[name] || [];
    const historyLabels = historyData.map((point: HistoricalDataPoint) => new Date(point.date).toLocaleDateString());
    const historyPrices = historyData.map((point: HistoricalDataPoint) => point.rate);

    console.log(`History Data for ${name}:`, historyData);
    console.log(`History Labels for ${name}:`, historyLabels);
    console.log(`History Prices for ${name}:`, historyPrices);

    return {
      labels: historyLabels,
      datasets: [
        { data: historyPrices, label: `${name} Historical Price (USD)`, borderColor: '#3e95cd', fill: false }
      ]
    };
  }
}
