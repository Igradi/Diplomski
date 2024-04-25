import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtDecodeService } from '../services/jwt-decode.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn = false;
  username: string | undefined;

  constructor(private jwtDecodeService: JwtDecodeService, private authService: AuthService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.jwtDecodeService.decodeToken(token);
      if (decodedToken) {
        this.isLoggedIn = true;
        this.username = decodedToken.username;
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = undefined;
  }
}