import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LivePricesService } from '../../services/live-prices.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { HistoricalDataPoint } from '../../models/historicalDataPoint.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from '../../services/loader.service';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { fadeInOut } from '../../services/animations';

Chart.register(...registerables);

@Component({
  selector: 'app-live-prices',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatProgressBarModule, FormsModule],
  templateUrl: './live-prices.component.html',
  styleUrls: ['./live-prices.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [fadeInOut]
})
export class LivePricesComponent {
  showCharts: boolean = false;
  showFilters: boolean = false;
  favoriteCryptosData: any[] = [];
  favoriteCryptosHistory: { [key: string]: HistoricalDataPoint[] } = {};
  searchQuery: string = '';

  minMarketCap: number = 0;
  maxMarketCap: number = 1000000000;
  minPrice: number = 0;
  maxPrice: number = 100000;
  minVolume: number = 0;
  maxVolume: number = 100000000;

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

  constructor(
    private livePricesService: LivePricesService,
    private authService: AuthService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    if (this.authService.getToken()) {
      this.loadFavoriteCryptos();
    } else {
      this.getAllCryptosData();
    }
  }

  loadFavoriteCryptos(): void {
    this.livePricesService.getFavoriteCryptosData().pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe(
      data => {
        this.favoriteCryptosData = data.map(item => {
          const crypto = item.data;
          return crypto;
        });
        this.favoriteCryptosHistory = data.reduce((acc, item) => {
          acc[item.data.name] = item.history.history;
          return acc;
        }, {});
        this.updateChartData();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getAllCryptosData(): void {
    this.livePricesService.getAllCryptosData().pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe(
      data => {
        this.favoriteCryptosData = data.map(item => {
          const crypto = item.data;
          return crypto;
        });
        this.favoriteCryptosHistory = data.reduce((acc, item) => {
          acc[item.data.name] = item.history.history;
          return acc;
        }, {});
        this.updateChartData();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  searchCurrency(): void {
    if (this.searchQuery.trim()) {
      this.loaderService.show();
      this.livePricesService.getCryptoByAbbreviation(this.searchQuery.trim().toUpperCase()).pipe(
        finalize(() => this.loaderService.hide())
      ).subscribe(
        data => {
          this.favoriteCryptosData = [data.data];
          this.favoriteCryptosHistory = {
            [data.data.name]: data.history.history
          };
          this.showCharts = true;
          this.updateChartData();
        },
        error => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  filterCurrencies(): void {
    const filteredData = this.favoriteCryptosData.filter(crypto => {
      return crypto.cap >= this.minMarketCap && crypto.cap <= this.maxMarketCap &&
        crypto.rate >= this.minPrice && crypto.rate <= this.maxPrice &&
        crypto.volume >= this.minVolume && crypto.volume <= this.maxVolume;
    });

    this.favoriteCryptosData = filteredData;
    this.updateChartData();
  }

  updateChartData(): void {
    if (this.favoriteCryptosData.length === 0) {
      console.warn('No favorite cryptocurrencies data available to update charts.');
      return;
    }

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

  toggleChartsView(): void {
    this.showCharts = !this.showCharts;
  }

  toggleFilterExpansion(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.minMarketCap = 0;
    this.maxMarketCap = 1000000000;
    this.minPrice = 0;
    this.maxPrice = 100000;
    this.minVolume = 0;
    this.maxVolume = 100000000;

    this.loaderService.show();
    if (this.authService.getToken()) {
      this.loadFavoriteCryptos();
    } else {
      this.getAllCryptosData();
    }
  }
}
