import { Component } from '@angular/core';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  cryptocurrencies: Cryptocurrency[] = [];

  constructor(private cryptocurrencyService: CryptocurrencyListService, private router: Router) { }

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

  onSelect(cryptocurrency: Cryptocurrency): void {
    console.log('Selected cryptocurrency:', cryptocurrency);
    this.router.navigate(['/home', cryptocurrency.name.toLowerCase() + '-posts']);
  }

}
