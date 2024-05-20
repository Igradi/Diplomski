import { Component } from '@angular/core';
import { PostListComponent } from '../post-list/post-list.component';
import { PollListComponent } from '../poll-list/poll-list.component';
@Component({
  selector: 'app-posts-and-polls',
  standalone: true,
  imports: [PostListComponent, PollListComponent],
  templateUrl: './posts-and-polls.component.html',
  styleUrl: './posts-and-polls.component.scss'
})
export class PostsAndPollsComponent {

}
