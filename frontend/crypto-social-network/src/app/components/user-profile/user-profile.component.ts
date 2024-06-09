import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { fadeInOut } from '../../services/animations';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  animations: [fadeInOut]
})
export class UserProfileComponent {
  user?: User;

  constructor(private route: ActivatedRoute, private userService: UserService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (user: User) => {
          this.user = user;
        },
        (error) => {
          console.error('Error getting user by ID:', error);
        }
      );
    } else {
      console.error('User ID not found.');
    }
  }

  isUserAdmin(): boolean {
    return this.authService.isAdmin();
  }

  updateUser(): void {
    if (this.user) {
      this.userService.updateUser(this.user._id, {
        username: this.user.username,
        email: this.user.email,
        role: this.user.role
      }).subscribe(
        () => {
          this.toastr.success('User updated successfully!', 'Success');
        },
        (error) => {
          console.error('Error updating user:', error);
          this.toastr.error('Failed to update user. Please try again later.', 'Error');
        }
      );
    }
  }
}
