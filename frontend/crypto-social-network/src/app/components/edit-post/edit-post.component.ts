import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent {
  postId: string = '';
  post: Post | undefined;
  newPostContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.postId = this.route.snapshot.params['id'];
    this.getPostById();
  }

  getPostById(): void {
    this.postService.getPostById(this.postId).subscribe(
      (data: Post) => {
        this.post = data;
        this.newPostContent = data.content;
      },
      (error) => {
        console.error('Error fetching post:', error);
      }
    );
  }

  updatePost(): void {
    if (this.newPostContent) {
      this.postService.updatePost(this.postId, this.newPostContent).subscribe(
        (data) => {
          this.toastr.success('Post updated successfully!');
          this.router.navigate(['/posts', this.post?.topic]);
        },
        (error) => {
          this.toastr.error('Error updating post!');
        }
      );
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/posts', this.post?.topic]);
  }
}