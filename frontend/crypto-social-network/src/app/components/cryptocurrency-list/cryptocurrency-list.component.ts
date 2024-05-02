import { Component } from '@angular/core';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cryptocurrency-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cryptocurrency-list.component.html',
  styleUrl: './cryptocurrency-list.component.scss'
})
export class CryptocurrencyListComponent {
  cryptocurrencies: Cryptocurrency[] = [];

  constructor(private cryptocurrencyService: CryptocurrencyListService) { }

  ngOnInit(): void {
    this.getCryptocurrencies();
  }

  getCryptocurrencies(): void {
    this.cryptocurrencyService.getAllCryptocurrencies().subscribe(
      (data: Cryptocurrency[]) => {
        this.cryptocurrencies = data;
      },
      (error) => {
        console.error('Error fetching cryptocurrencies:', error);
      }
    );
  }

  toggleFavorite(cryptocurrency: Cryptocurrency): void {
  }

  isFavorite(cryptocurrency: Cryptocurrency): void {
  }
}
