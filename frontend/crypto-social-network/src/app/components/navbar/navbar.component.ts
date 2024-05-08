import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtDecodeService } from '../../services/jwt-decode.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  username: string | undefined;
  userId: string | undefined;
  isAdmin = false;

  constructor(
    private jwtDecodeService: JwtDecodeService,
    private authService: AuthService,
    private router: Router
  ) { }

  isUserAuthenticated(): boolean {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = this.jwtDecodeService.decodeToken(token);
      if (decodedToken) {
        this.username = decodedToken.username;
        this.userId = decodedToken.id;
        this.isAdmin = this.authService.isAdmin();
      }
      return true;
    } else {
      this.username = undefined;
      this.isAdmin = false;
      return false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isUserAuthenticated();
  }

  goToUserProfile(): void {
    if (this.userId) {
      this.router.navigate(['/user-profile', this.userId]);
    }
  }
}
