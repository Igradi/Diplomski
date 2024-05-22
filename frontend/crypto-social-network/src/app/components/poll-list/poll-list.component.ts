import { Component } from '@angular/core';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post-list.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.scss']
})
export class PollListComponent {

  polls: Poll[] = [];
  selectedOptions: { [pollId: string]: { [questionIndex: number]: number } } = {};
  userId: string | null = null;

  constructor(
    private pollService: PollService,
    private userService: UserService,
    private postService: PostService,
    private toastr: ToastrService
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
          this.selectedOptions[poll._id] = {};
          poll.questions.forEach((question, questionIndex) => {
            if (question.answeredBy.includes(this.userId!)) {
              this.selectedOptions[poll._id][questionIndex] = question.options.findIndex(option => option === question.correctAnswerIndex.toString());
            }
          });
        });
      },
      (error) => {
        console.error('Error fetching polls:', error);
      }
    );
  }

  submitVotes(pollId: string): void {
    if (this.userId) {
      const votes = Object.keys(this.selectedOptions[pollId]).map(questionIndex => ({
        questionIndex: parseInt(questionIndex, 10),
        selectedOptionIndex: this.selectedOptions[pollId][parseInt(questionIndex, 10)]

      }));

      this.pollService.submitVotes(pollId, votes, this.userId).subscribe(
        (data) => {
          this.toastr.success('Votes submitted successfully', 'Success');
          this.getAllPolls();
        },
        (error) => {
          this.toastr.error('Failed to submit votes', 'You have already voted.');
        }
      );
    }
  }

  getPercentage(correctVotes: number, totalVotes: number): number {
    return totalVotes > 0 ? (correctVotes / totalVotes) * 100 : 0;
  }

  hasQuestionsWithVotes(poll: Poll): boolean {
    return poll.questions.some(q => q.totalVotes > 0);
  }

  toggleQuestions(poll: Poll): void {
    poll.showQuestions = !poll.showQuestions;
  }

  toggleResults(poll: Poll): void {
    poll.showResults = !poll.showResults;
  }
}
