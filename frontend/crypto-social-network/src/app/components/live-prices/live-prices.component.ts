import { Component } from '@angular/core';
import { LivePricesService } from '../../services/live-prices.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-live-prices',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './live-prices.component.html',
  styleUrl: './live-prices.component.scss'
})

export class LivePricesComponent {
  favoriteCryptosData: any[];

  public lineChartData: ChartConfiguration['data'] | undefined;
  public barChartData: ChartConfiguration['data'] | undefined;
  public pieChartData: ChartConfiguration['data'] | undefined;

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  constructor(private livePricesService: LivePricesService) {
    this.favoriteCryptosData = [];
  }

  ngOnInit(): void {
    this.livePricesService.getFavoriteCryptosData().subscribe(data => {
      this.favoriteCryptosData = data;
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
  }
}