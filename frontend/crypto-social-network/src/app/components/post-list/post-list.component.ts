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
import { PaginatorModule } from 'primeng/paginator';
import { ToastrService } from 'ngx-toastr';
import { fadeInOut } from '../../services/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentListComponent, PaginatorModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  animations: [fadeInOut]
})
export class PostListComponent {
  posts: Post[] = [];
  newPostContent: string = '';
  sortBy: string = 'date';
  p: number = 1;
  itemsPerPage: number = 5;
  totalRecords: number = 0;
  showNewPostForm: boolean = false;
  topicName: string = '';
  previewLength: number = 500;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private router: Router,
    public userService: UserService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.topicName = this.getTopicNameFromUrl();
  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getTopicNameFromUrl(): string {
    const urlSegments = this.router.url.split('/');
    return urlSegments[urlSegments.length - 1];
  }

  getAllPosts(): void {
    this.postService.getAllPosts().subscribe(
      (data: Post[]) => {
        if (this.postService.selectedTopic) {
          this.posts = data.filter(post => post.topic._id === this.postService.selectedTopic);
        } else {
          this.posts = data;
        }
        this.totalRecords = this.posts.length;
        this.posts.forEach(post => {
          post.showOptions = false;
          post.isExpanded = false;
        });
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
    } else if (this.sortBy === 'most_commented') {
      this.posts.sort((a, b) => b.comments.length - a.comments.length);
    } else if (this.sortBy === 'recently_updated') {
      this.posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (this.sortBy === 'most_popular') {
      this.posts.sort((a, b) => this.calculatePopularity(b) - this.calculatePopularity(a));
    }
  }

  calculatePopularity(post: Post): number {
    const now = new Date().getTime();
    const createdAt = new Date(post.createdAt).getTime();
    const updatedAt = new Date(post.updatedAt).getTime();
    const ageInMilliseconds = now - createdAt;
    const lastUpdatedInMilliseconds = now - updatedAt;

    const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
    const DAY_IN_MS = 1000 * 60 * 60 * 24;

    const ageFactor = Math.log(1 + (YEAR_IN_MS / ageInMilliseconds));
    const lastUpdatedFactor = Math.log(1 + (DAY_IN_MS / lastUpdatedInMilliseconds));
    const commentFactor = Math.log(1 + post.comments.length);
    const voteFactor = post.upvotes - post.downvotes;

    const AGE_WEIGHT = 1.0;
    const UPDATED_WEIGHT = 0.5;
    const COMMENT_WEIGHT = 2.0;
    const VOTE_WEIGHT = 1.5;

    return (AGE_WEIGHT * ageFactor) +
      (UPDATED_WEIGHT * lastUpdatedFactor) +
      (COMMENT_WEIGHT * commentFactor) +
      (VOTE_WEIGHT * voteFactor);
  }

  changeSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.sortPosts();
  }

  addComment(postId: string, content: string): void {
    this.commentService.createComment(postId, content).subscribe(
      (data) => {
        this.getAllPosts();
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }

  upvotePost(postId: string): void {
    this.postService.upvotePost(postId).subscribe(() => {
      this.getAllPosts();
    });
  }

  downvotePost(postId: string): void {
    this.postService.downvotePost(postId).subscribe(() => {
      this.getAllPosts();
    });
  }

  createPost(): void {
    if (this.newPostContent && this.postService.selectedTopic) {
      this.postService.createPost(this.newPostContent, this.postService.selectedTopic).subscribe(
        (data) => {
          this.toastr.success('Post created successfully!');
          this.newPostContent = '';
          this.showNewPostForm = false;
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
        this.postService.deletePost(postId).subscribe(() => {
          this.getAllPosts();
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        }, (error) => {
          Swal.fire('Error!', 'There was an error deleting your post.', 'error');
        });
      }
    });
  }

  toggleOptions(postId: string): void {
    this.posts = this.posts.map(post => ({
      ...post,
      showOptions: post._id === postId ? !post.showOptions : false
    }));
  }

  canDeletePost(post: Post): boolean {
    return this.authService.isAdmin() || (post.user && post.user._id === this.userService.getUserIdFromToken());
  }

  canEditPost(post: Post): boolean {
    return post.user && post.user._id === this.userService.getUserIdFromToken();
  }

  onPageChange(event: any): void {
    this.p = event.page + 1;
    this.itemsPerPage = event.rows;
  }

  toggleNewPostForm(): void {
    this.showNewPostForm = !this.showNewPostForm;
  }

  cancelNewPost(): void {
    this.newPostContent = '';
    this.showNewPostForm = false;
  }

  toggleReadMore(post: Post): void {
    post.isExpanded = !post.isExpanded;
  }
}
