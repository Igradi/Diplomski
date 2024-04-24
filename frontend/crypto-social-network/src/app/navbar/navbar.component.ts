import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtDecodeService } from '../services/jwt-decode.service';

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

  constructor(private jwtDecodeService: JwtDecodeService) { }

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
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.username = undefined;
  }
}