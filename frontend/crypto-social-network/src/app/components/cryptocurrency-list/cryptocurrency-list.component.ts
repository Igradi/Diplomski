import { Component } from '@angular/core';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { CommonModule } from '@angular/common';
import { JwtDecodeService } from '../../services/jwt-decode.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-cryptocurrency-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cryptocurrency-list.component.html',
  styleUrl: './cryptocurrency-list.component.scss'
})
export class CryptocurrencyListComponent {
  cryptocurrencies: Cryptocurrency[] = [];
  user!: User;

  constructor(private cryptocurrencyService: CryptocurrencyListService, private jwtDecodeService: JwtDecodeService, private authService: AuthService, private toastr: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
    this.getCryptocurrencies();
    this.getUser();
  }

  getUser(): void {
    this.userService.getUserByIdFromToken().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  isFavorite(cryptocurrency: Cryptocurrency): boolean {
    return this.user?.favorites.includes(cryptocurrency._id);
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
    this.userService.getUserByIdFromToken().subscribe(
      (user) => {
        this.cryptocurrencyService.toggleFavoriteCryptocurrency(cryptocurrency._id, user._id).subscribe(
          (response) => {
            this.user = response.user;
            this.toastr.success(response.msg);
          },
          (error) => {
            console.error('Error toggling favorite cryptocurrency:', error);
            this.toastr.error('An error occurred.');
          }
        );
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

}
