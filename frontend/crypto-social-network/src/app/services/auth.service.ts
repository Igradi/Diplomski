import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:4000/api/users/login', { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  canActivate(): boolean {
    if (!!localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
