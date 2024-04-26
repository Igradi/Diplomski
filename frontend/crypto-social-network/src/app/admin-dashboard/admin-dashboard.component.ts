import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  users: User[] = [];
  newUser: User = { _id: '', username: '', password: '', email: '', role: '' };

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.loadUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  editUser(userId: string): void {

  }

  addUser(): void {
    const { username, email, password, role } = this.newUser;
    if (username && email && password && role) {
      this.userService.addUser(username, email, password, role).subscribe(
        () => {
          this.loadUsers();
          this.newUser = { _id: '', username: '', email: '', password: '', role: '' };
        },
        (error) => {
          console.error('Error adding user:', error);
        }
      );
    } else {
      console.error('Please provide all required user fields.');
    }
  }
}
