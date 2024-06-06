import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { fadeInOut } from '../../services/animations';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, TooltipModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [fadeInOut]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (res: any) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/home']);
        this.toastr.success('Login successful!', 'Success');
      },
      (error) => {
        console.error('Error logging in:', error);
        this.toastr.error('Failed to login. Please check your credentials and try again.', 'Error');
      }
    );
  }
}