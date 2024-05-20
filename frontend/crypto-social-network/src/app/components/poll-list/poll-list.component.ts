import { Component } from '@angular/core';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(
    private pollService: PollService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getAllPolls();
  }

  getAllPolls(): void {
    this.pollService.getAllPolls().subscribe(
      (data: Poll[]) => {
        this.polls = data;
      },
      (error) => {
        console.error('Error fetching polls:', error);
      }
    );
  }

  submitVote(pollId: string, selectedOptionIndex: number): void {
    const userId = this.userService.getUserIdFromToken();

    if (userId) {
      this.pollService.submitVote(pollId, selectedOptionIndex, userId).subscribe(
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