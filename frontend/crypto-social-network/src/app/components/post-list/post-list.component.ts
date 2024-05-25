import { Component } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post-list.service';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentListComponent, NgxPaginationModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
  posts: Post[] = [];
  newPostContent: string = '';
  sortBy: string = 'date';
  p: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private router: Router,
    public userService: UserService,
    public authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getAllPosts().subscribe(
      (data: Post[]) => {
        if (this.postService.selectedTopic) {
          this.posts = data.filter(post => post.topic === this.postService.selectedTopic);
        } else {
          this.posts = data;
        }
        this.sortPosts();
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  sortPosts(): void {
    if (this.sortBy === 'date') {
      this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortBy === 'hot') {
      this.posts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    }
  }

  changeSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.sortPosts();
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

  createPost(): void {
    if (this.newPostContent && this.postService.selectedTopic) {
      this.postService.createPost(this.newPostContent, this.postService.selectedTopic).subscribe(
        (data) => {
          console.log('Post created successfully:', data);
          this.toastr.success('Post created successfully!');
          this.newPostContent = '';
          this.getAllPosts();
        },
        (error) => {
          console.error('Error creating post:', error);
        }
      );
    }
  }

  editPost(postId: string): void {
    this.router.navigate(['/edit-post', postId]);
  }

  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe(
      (data) => {
        console.log('Post deleted successfully:', data);
        this.getAllPosts();
      },
      (error) => {
        console.error('Error deleting post:', error);
      }
    );
  }
}
