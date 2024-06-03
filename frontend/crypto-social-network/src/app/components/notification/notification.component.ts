import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() notifications: Notification[] = [];
  @Output() notificationRead = new EventEmitter<string>();
  userId: string | null;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router
  ) {
    this.userId = this.userService.getUserIdFromToken();
  }

  ngOnInit(): void {
    if (this.userId) {
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    if (this.userId) {
      this.notificationService.getNotifications(this.userId).subscribe((data) => {
        this.notifications = data;
      });
    }
  }

  markAsRead(event: Event, notificationId: string): void {
    event.stopPropagation();
    this.notificationService.markAsRead(notificationId).subscribe(
      (response) => {
        this.notificationRead.emit(notificationId);
      },
      (error) => {
      }
    );
  }

  navigateToPostDetails(postId?: string): void {
    this.router.navigate([`/post-details/${postId}`]);
  }
}
