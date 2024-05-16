import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { JwtDecodeService } from './jwt-decode.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient, private jwtDecodeService: JwtDecodeService, private authService: AuthService) { }

  generateHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', token || '');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAllUsers`, { headers: this.generateHeaders() });
  }

  addUser(username: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password, role }, { headers: this.generateHeaders() });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${userId}`, { headers: this.generateHeaders() });
  }

  updateUser(userId: string, newData: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${userId}`, newData, { headers: this.generateHeaders() });
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserById/${userId}`, { headers: this.generateHeaders() });
  }

  getUserIdFromToken(): string | null {
    const token = this.authService.getToken() ?? '';
    const decodedToken = this.jwtDecodeService.decodeToken(token);
    return decodedToken ? decodedToken.id : null;
  }

  getUserByIdFromToken(): Observable<User> {
    const userId = this.getUserIdFromToken();
    if (userId) {
      return this.getUserById(userId);
    } else {
      throw new Error('Unable to retrieve user ID from token.');
    }
  }
}
