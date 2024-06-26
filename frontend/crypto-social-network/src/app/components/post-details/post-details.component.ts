import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post-list.service';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { fadeIn, fadeInOut, fadeOut } from '../../services/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-details',
  standalone: true,
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  imports: [CommonModule, FormsModule, CommentListComponent],
  animations: [fadeIn, fadeInOut, fadeOut],
})
export class PostDetailsComponent {
  post?: Post;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.getPost(postId);
    }
  }

  getPost(postId: string): void {
    this.postService.getPostById(postId).subscribe(
      (data: Post) => {
        this.post = data;
      },
      (error) => {
        console.error('Error fetching post:', error);
      }
    );
  }

  upvotePost(postId: string): void {
    this.postService.upvotePost(postId).subscribe(() => {
      this.getPost(postId);
    });
  }

  downvotePost(postId: string): void {
    this.postService.downvotePost(postId).subscribe(() => {
      this.getPost(postId);
    });
  }

  editPost(postId: string): void {
    this.router.navigate(['/edit-post', postId]);
  }

  deletePost(postId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(postId).subscribe(
          () => {
            this.router.navigate(['/home']);
            Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
          },
          (error) => {
            Swal.fire('Error!', 'There was an error deleting your post.', 'error');
          }
        );
      }
    });
  }

  canEditPost(post: Post): boolean {
    return post.user && post.user._id === this.userService.getUserIdFromToken();
  }

  canDeletePost(post: Post): boolean {
    return this.authService.isAdmin() || (post.user && post.user._id === this.userService.getUserIdFromToken());
  }

  toggleOptions(postId: string): void {
    if (this.post) {
      this.post.showOptions = !this.post.showOptions;
    }
  }
}
