import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtDecodeService } from '../../services/jwt-decode.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username: string | undefined;
  userId: string | undefined;
  isAdmin = false;
  notifications: Notification[] = [];
  showNotifications = false;

  constructor(
    private jwtDecodeService: JwtDecodeService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (this.isUserAuthenticated()) {
      this.loadNotifications();
    }
  }

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

  loadNotifications(): void {
    if (this.userId) {
      this.notificationService.getNotifications(this.userId).subscribe((data) => {
        this.notifications = data;
      });
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
