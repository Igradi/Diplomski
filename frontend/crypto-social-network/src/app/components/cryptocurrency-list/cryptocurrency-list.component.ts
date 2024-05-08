import { Component } from '@angular/core';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { CommonModule } from '@angular/common';
import { JwtDecodeService } from '../../services/jwt-decode.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cryptocurrency-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cryptocurrency-list.component.html',
  styleUrl: './cryptocurrency-list.component.scss'
})
export class CryptocurrencyListComponent {
  cryptocurrencies: Cryptocurrency[] = [];

  constructor(private cryptocurrencyService: CryptocurrencyListService, private jwtDecodeService: JwtDecodeService, private authService: AuthService, private toastr: ToastrService) { }

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
    const token = this.authService.getToken() ?? '';
    const decodedToken = this.jwtDecodeService.decodeToken(token);

    const userId = decodedToken.id;

    this.cryptocurrencyService.toggleFavoriteCryptocurrency(cryptocurrency._id, userId).subscribe(
      (response) => {
        this.getCryptocurrencies();
        this.toastr.success(response.msg);
      },
      (error) => {
        console.error('Error toggling favorite cryptocurrency:', error);
        this.toastr.error('An error occurred.');
      }
    );
  }

}
