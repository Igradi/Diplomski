import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { PostService } from '../../services/post-list.service';
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
export class EditCommentComponent implements OnInit {
  commentId: string = '';
  comment: Comment | undefined;
  newCommentContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private postService: PostService,
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
          this.navigateToPostTopic();
        },
        (error) => {
          this.toastr.error('Error updating comment!', 'Error');
        }
      );
    }
  }

  cancelEdit(): void {
    this.navigateToPostTopic();
  }

  private navigateToPostTopic(): void {
    this.postService.getAllPosts().subscribe(
      (posts) => {
        const post = posts.find(p => p.comments.includes(this.commentId));
        if (post) {
          this.router.navigate(['/posts', post.topic.name.toLowerCase()]);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.router.navigate(['/home']);
      }
    );
  }
}
