import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (res: any) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}