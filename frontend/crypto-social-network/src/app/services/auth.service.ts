import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { JwtDecodeService } from './jwt-decode.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private jwtDecodeService: JwtDecodeService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:4000/api/users/login', { email, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:4000/api/users/register', { username, email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.authStatusListener.next(true);
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.jwtDecodeService.decodeToken(token);
      const tokenExpired = Date.now() >= decodedToken.exp * 1000;
      if (tokenExpired) {
        localStorage.removeItem('token');
        return null;
      }
    }
    return token;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }

  canActivate(): boolean {
    if (!!localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.jwtDecodeService.decodeToken(token);
      return decodedToken && decodedToken.role === 'admin';
    }
    return false;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }
}
