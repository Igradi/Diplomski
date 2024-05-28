import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PollService } from '../../services/poll.service';
import { Poll } from '../../models/poll.model';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-poll-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatProgressBarModule],
  templateUrl: './poll-analytics.component.html',
  styleUrl: './poll-analytics.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PollAnalyticsComponent {
  pollData: Poll | undefined;
  questionChartData: { [key: string]: ChartConfiguration['data'] } = {};
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  loading: boolean = false;

  constructor(private pollService: PollService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;
    const pollId = this.route.snapshot.paramMap.get('id');
    if (pollId) {
      this.pollService.getPollById(pollId).subscribe(
        data => {
          this.pollData = data;
          this.updateChartData();
          this.loading = false;
        },
        error => {
          console.error('Error fetching poll data:', error);
          this.loading = false;
        }
      );
    }
  }

  updateChartData(): void {
    if (this.pollData) {
      this.pollData.questions.forEach(question => {
        const labels = question.options;
        const votes = question.optionVotes.map(votes => votes || 0);

        this.questionChartData[question.question] = {
          labels: labels,
          datasets: [
            {
              data: votes,
              backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
              label: question.question
            }
          ]
        };
      });
    }
  }
}