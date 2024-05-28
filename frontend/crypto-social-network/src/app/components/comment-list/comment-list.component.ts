import { Component, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fadeInOut } from '../../services/animations';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  imports: [FormsModule, CommonModule],
  animations: [fadeInOut],
})
export class CommentListComponent {
  @Input() postId?: string;
  @Input() showAllComments: boolean = false;
  comments: Comment[] = [];
  limitedComments: Comment[] = [];
  newCommentContent: string = '';

  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCommentsForPost();
  }

  getCommentsForPost(): void {
    if (this.postId) {
      this.commentService.getComments(this.postId).subscribe(
        (data: Comment[]) => {
          this.comments = data;
          this.limitedComments = this.showAllComments ? this.comments : this.comments.slice(0, 5);
        },
        (error) => {
          console.error('Error fetching comments:', error);
        }
      );
    } else {
      console.error('Post ID is undefined');
    }
  }

  addComment(): void {
    if (this.postId && this.newCommentContent) {
      this.commentService.createComment(this.postId, this.newCommentContent).subscribe(
        (data) => {
          this.toastr.success('Comment added successfully!', 'Success');
          this.newCommentContent = '';
          this.getCommentsForPost();
        },
        (error) => {
          this.toastr.error('Error adding comment!', 'Error');
        }
      );
    }
  }

  editComment(commentId: string): void {
    this.router.navigate(['/edit-comment', commentId]);
  }

  deleteComment(commentId: string): void {
    if (this.postId) {
      this.commentService.deleteComment(commentId).subscribe(
        () => {
          this.getCommentsForPost();
        },
        (error) => {
          console.error('Error deleting comment:', error);
        }
      );
    }
  }

  canEditComment(comment: Comment): boolean {
    return comment.user && comment.user._id === this.userService.getUserIdFromToken();
  }

  canDeleteComment(comment: Comment): boolean {
    return this.authService.isAdmin() || (comment.user && comment.user._id === this.userService.getUserIdFromToken());
  }

  viewAllComments(): void {
    this.router.navigate(['/post-details', this.postId]);
  }
}
