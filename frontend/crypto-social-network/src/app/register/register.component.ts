import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const registerObj = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:4000/api/users/register', registerObj).subscribe((res: any) => {
      this.router.navigate(['/login']);
    });
  }
}
