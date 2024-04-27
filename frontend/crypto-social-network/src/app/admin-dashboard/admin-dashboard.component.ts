import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private toastr: ToastrService) { }

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
        this.toastr.success('User deleted successfully!', 'Success');
      },
      (error) => {
        this.toastr.error('Failed to delete user. Please try again later.', 'Error');
      }
    );
  }


  editUser(userId: string): void {
    this.router.navigateByUrl(`/user-profile/${userId}`);
  }

  addUser(): void {
    const { username, email, password, role } = this.newUser;
    if (username && email && password && role) {
      this.userService.addUser(username, email, password, role).subscribe(
        () => {
          this.loadUsers();
          this.newUser = { _id: '', username: '', email: '', password: '', role: '' };
          this.toastr.success('User added successfully!', 'Success');
        },
        (error) => {
          this.toastr.error('Failed to add user. Please try again later.', 'Error');
        }
      );
    } else {
      this.toastr.error('Please provide all required user fields.', 'Error');
    }
  }
}
