import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PollService } from '../services/poll.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-polls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-polls.component.html',
  styleUrl: './manage-polls.component.scss'
})
export class ManagePollsComponent {

  polls: any[] = [];

  constructor(private pollService: PollService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    this.pollService.getAllPolls().subscribe(
      (polls) => {
        this.polls = polls;
      },
      (error) => {
        this.toastr.error('Failed to load polls. Please try again later.', 'Error');
      }
    );
  }

  deletePoll(pollId: string): void {
    if (confirm('Are you sure you want to delete this poll?')) {
      this.pollService.deletePoll(pollId).subscribe(
        () => {
          this.polls = this.polls.filter(poll => poll._id !== pollId);
          this.toastr.success('Poll deleted successfully!', 'Success');
        },
        (error) => {
          this.toastr.error('Failed to delete poll. Please try again later.', 'Error');
        }
      );
    }
  }
}