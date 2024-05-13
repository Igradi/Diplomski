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
  bitcoinData: any;
  rippleData: any;
  ethereumData: any;
  dogecoinData: any;

  constructor(private livePricesService: LivePricesService) { }

  ngOnInit(): void {
    this.livePricesService.getBitcoinData().subscribe(data => {
      this.bitcoinData = data;
    });
    this.livePricesService.getRippleData().subscribe(data => {
      this.rippleData = data;
    });
    this.livePricesService.getEthereumData().subscribe(data => {
      this.ethereumData = data;
    });
    this.livePricesService.getDogecoinData().subscribe(data => {
      this.dogecoinData = data;
    });
  }
}
