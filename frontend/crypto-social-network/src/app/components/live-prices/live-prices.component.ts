import { Component } from '@angular/core';
import { LivePricesService } from '../../services/live-prices.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-live-prices',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './live-prices.component.html',
  styleUrl: './live-prices.component.scss'
})

export class LivePricesComponent {
  favoriteCryptosData: any[];

  constructor(private livePricesService: LivePricesService) {
    this.favoriteCryptosData = [];
  }

  ngOnInit(): void {
    this.livePricesService.getFavoriteCryptosData().subscribe(data => {
      this.favoriteCryptosData = data;
    });
  }
}
