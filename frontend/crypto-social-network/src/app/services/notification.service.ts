import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private baseUrl: string = 'http://localhost:4000/api/notifications';

    constructor(private http: HttpClient, private userService: UserService) { }

    getNotifications(userId: string): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.baseUrl}/${userId}`, { headers: this.userService.generateHeaders() });
    }

    markAsRead(notificationId: string): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/mark-as-read/${notificationId}`, {}, { headers: this.userService.generateHeaders() });
    }
}
