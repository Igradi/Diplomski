import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post-list.service';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  posts: Post[] = [];

  constructor(private postService: PostService, private commentService: CommentService) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getAllPosts().subscribe(
      (data: Post[]) => {
        this.posts = data;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
  addComment(postId: string, content: string): void {
    this.commentService.createComment(postId, content).subscribe(
      (data) => {
        console.log('Comment added successfully:', data);
        this.getAllPosts();
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }

  upvotePost(postId: string): void {
    this.postService.upvotePost(postId).subscribe(
      (data) => {
        console.log('Post upvoted successfully:', data);
        this.getAllPosts();
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
        this.getAllPosts();
      },
      (error) => {
        console.error('Error downvoting post:', error);
      }
    );
  }
}