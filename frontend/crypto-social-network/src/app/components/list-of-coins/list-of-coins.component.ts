import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { LivePricesService } from '../../services/live-prices.service';

@Component({
  selector: 'app-list-of-coins',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './list-of-coins.component.html',
  styleUrls: ['./list-of-coins.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListOfCoinsComponent {
  cryptocurrencies: Cryptocurrency[] = [];

  constructor(
    private cryptocurrencyListService: CryptocurrencyListService,
    private livePricesService: LivePricesService
  ) { }

  ngOnInit(): void {
    this.cryptocurrencyListService.getAllCryptocurrencies().subscribe(
      (data: Cryptocurrency[]) => {
        this.cryptocurrencies = data;
      },
      (error) => {
        console.error('Error fetching cryptocurrencies:', error);
      }
    );
  }

  onCoinClick(abbreviation: string): void {
    this.livePricesService.selectCoin(abbreviation);
  }
}
