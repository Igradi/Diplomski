import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

  onLogin() {
    const loginObj = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:4000/api/users/login', loginObj).subscribe((res: any) => {
      if (res.result) {
        alert("Uspješno logovanje");
      } else {
        alert(res.message)
      }
    });
  }
}
