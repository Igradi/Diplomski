import { Component } from '@angular/core';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService } from '../../services/poll.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [FormsModule, CommonModule, DropdownModule],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent {
  cryptocurrencies: Cryptocurrency[] = [];
  selectedCurrencyId: string = '';
  title: string = '';
  questions: { question: string, options: { value: string }[], correctAnswerIndex: number }[] = [];

  constructor(
    private cryptocurrencyService: CryptocurrencyListService,
    private pollService: PollService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCryptocurrencies();
    this.addQuestion();
  }

  getCryptocurrencies(): void {
    this.cryptocurrencyService.getAllCryptocurrencies().subscribe(
      cryptocurrencies => {
        this.cryptocurrencies = cryptocurrencies;
      },
      error => {
        console.error('Error fetching cryptocurrencies:', error);
      }
    );
  }

  addQuestion(): void {
    this.questions.push({
      question: '',
      options: [{ value: '' }, { value: '' }],
      correctAnswerIndex: 0
    });
  }

  addOption(questionIndex: number): void {
    this.questions[questionIndex].options.push({ value: '' });
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    this.questions[questionIndex].options.splice(optionIndex, 1);
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  createPoll(): void {
    const pollData = {
      title: this.title,
      questions: this.questions.map(q => ({
        question: q.question,
        options: q.options.map(option => option.value),
        correctAnswerIndex: q.correctAnswerIndex
      })),
      topic: this.selectedCurrencyId
    };

    this.pollService.createPoll(pollData).subscribe(
      response => {
        this.toastr.success('Quiz created successfully!', 'Success');
        this.router.navigate(['/admin-dashboard']);
      },
      error => {
        this.toastr.error('Failed to create quiz.', 'Error');
      }
    );
  }
}
