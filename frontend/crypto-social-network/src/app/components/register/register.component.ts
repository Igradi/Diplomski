import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { fadeInOut } from '../../services/animations';
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, TooltipModule, PasswordModule, InputTextModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  animations: [fadeInOut]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.', 'Error');
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe(
      (res: any) => {
        this.router.navigate(['/login']);
        this.toastr.success('Registration successful! You can now login.', 'Success');
      },
      (error) => {
        console.error('Error registering:', error);
        this.toastr.error('Failed to register. Please try again later.', 'Error');
      }
    );
  }
}
