import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
  imports: [FormsModule, CommonModule],
})
export class CommentListComponent implements OnInit {
  @Input() postId?: string;
  comments: Comment[] = [];
  newCommentContent: string = '';

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.getCommentsForPost();
  }

  getCommentsForPost(): void {
    if (this.postId) {
      this.commentService.getComments(this.postId).subscribe(
        (data: Comment[]) => {
          this.comments = data;
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
          console.log('Comment added successfully:', data);
          this.newCommentContent = '';
          this.getCommentsForPost();
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }
}