import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {
  commentId: string = '';
  comment: Comment | undefined;
  newCommentContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.commentId = this.route.snapshot.params['id'];
    this.getCommentById();
  }

  getCommentById(): void {
    this.commentService.getCommentById(this.commentId).subscribe(
      (data: Comment) => {
        this.comment = data;
        this.newCommentContent = data.content;
      },
      (error) => {
        console.error('Error fetching comment:', error);
      }
    );
  }

  updateComment(): void {
    if (this.newCommentContent) {
      this.commentService.editComment(this.commentId, this.newCommentContent).subscribe(
        (data) => {
          this.toastr.success('Comment updated successfully!', 'Success');
          this.router.navigate(['/home']);
        },
        (error) => {
          this.toastr.error('Error updating comment!', 'Error');
        }
      );
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/home']);
  }
}
