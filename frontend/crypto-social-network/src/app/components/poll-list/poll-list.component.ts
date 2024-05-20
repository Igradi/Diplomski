import { Component } from '@angular/core';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post-list.service';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './poll-list.component.html',
  styleUrl: './poll-list.component.scss'
})
export class PollListComponent {

  polls: Poll[] = [];
  selectedOptions: { [pollId: string]: number } = {};
  userId: string | null = null;

  constructor(
    private pollService: PollService,
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserIdFromToken();
    this.getAllPolls();
  }

  getAllPolls(): void {
    this.pollService.getAllPolls().subscribe(
      (data: Poll[]) => {
        if (this.postService.selectedTopic) {
          this.polls = data.filter(poll => poll.topic === this.postService.selectedTopic);
        } else {
          this.polls = data;
        }

        this.polls.forEach(poll => {
          if (poll.answeredBy.includes(this.userId!)) {
            this.selectedOptions[poll._id] = poll.options.findIndex(option => option === poll.correctAnswerIndex.toString());
          }
        });
      },
      (error) => {
        console.error('Error fetching polls:', error);
      }
    );
  }

  submitVote(pollId: string, selectedOptionIndex: number): void {
    if (this.userId) {
      this.pollService.submitVote(pollId, selectedOptionIndex, this.userId).subscribe(
        (data) => {
          console.log('Vote submitted successfully:', data);
          this.getAllPolls();
        },
        (error) => {
          console.error('Error submitting vote:', error);
        }
      );
    }
  }

  getPercentage(correctVotes: number, totalVotes: number): number {
    return totalVotes > 0 ? (correctVotes / totalVotes) * 100 : 0;
  }
}
