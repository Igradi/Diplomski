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
  loginObj: Login;

  constructor(private http: HttpClient) {
    this.loginObj = new Login();
  }
  onLogin() {
    this.http.post('http://localhost:4000/api/users/login', this.loginObj).subscribe((res: any) => {
      if (res.result) {
        alert("Uspjesno logovanje");
      } else {
        alert(res.message)
      }
    });
  }

}

export class Login {

  email: string;
  password: string;
  constructor() {
    this.email = "";
    this.password = "";
  }
}
