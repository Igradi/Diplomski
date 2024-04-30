import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtDecodeService } from '../../services/jwt-decode.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  userId: string | undefined;
  isAdmin = false;

  constructor(
    private jwtDecodeService: JwtDecodeService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.jwtDecodeService.decodeToken(token);
      if (decodedToken) {
        this.isLoggedIn = true;
        this.username = decodedToken.username;
        this.userId = decodedToken.id;
        this.isAdmin = this.authService.isAdmin();
        console.log(decodedToken.role);
        console.log(this.username, this.userId, this.isAdmin);
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = undefined;
    this.isAdmin = false;
  }

  goToUserProfile(): void {
    if (this.userId) {
      this.router.navigate(['/user-profile', this.userId]);
    }
  }
}
