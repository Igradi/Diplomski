import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { fadeInOut } from '../../services/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, PaginatorModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [fadeInOut]
})
export class AdminDashboardComponent {
  users: User[] = [];
  newUser: User = { _id: '', username: '', password: '', email: '', role: '', favorites: [] };
  p: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        this.totalItems = users.length;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            this.loadUsers();
            this.toastr.success('User deleted successfully!', 'Success');
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          },
          (error) => {
            this.toastr.error('Failed to delete user. Please try again later.', 'Error');
            Swal.fire('Error!', 'There was an error deleting the user.', 'error');
          }
        );
      }
    });
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
          this.newUser = { _id: '', username: '', email: '', password: '', role: '', favorites: [] };
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

  onPageChange(event: any): void {
    this.p = event.page + 1;
    this.itemsPerPage = event.rows;
  }
}
