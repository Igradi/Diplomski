import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post-list.service';
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentListComponent } from '../comment-list/comment-list.component';

@Component({
  selector: 'app-post-details',
  standalone: true,
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  imports: [CommonModule, FormsModule, CommentListComponent],
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
    this.postService.upvotePost(postId).subscribe(
      (data) => {
        console.log('Post upvoted successfully:', data);
        this.getPost(postId);
      },
      (error) => {
        console.error('Error upvoting post:', error);
      }
    );
  }

  downvotePost(postId: string): void {
    this.postService.downvotePost(postId).subscribe(
      (data) => {
        console.log('Post downvoted successfully:', data);
        this.getPost(postId);
      },
      (error) => {
        console.error('Error downvoting post:', error);
      }
    );
  }

  editPost(postId: string): void {
    this.router.navigate(['/edit-post', postId]);
  }

  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error deleting post:', error);
      }
    );
  }

  canEditPost(post: Post): boolean {
    return post.user && post.user._id === this.userService.getUserIdFromToken();
  }

  canDeletePost(post: Post): boolean {
    return this.authService.isAdmin() || (post.user && post.user._id === this.userService.getUserIdFromToken());
  }
}
