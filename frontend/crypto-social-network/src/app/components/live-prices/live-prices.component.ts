import { Component } from '@angular/core';
import { LivePricesService } from '../../services/live-prices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-prices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-prices.component.html',
  styleUrl: './live-prices.component.scss'
})
export class LivePricesComponent {
  bitcoinData: any;

  constructor(private livePricesService: LivePricesService) { }

  ngOnInit(): void {
    this.livePricesService.getBitcoinData().subscribe(data => {
      this.bitcoinData = data;
    });
  }
}
