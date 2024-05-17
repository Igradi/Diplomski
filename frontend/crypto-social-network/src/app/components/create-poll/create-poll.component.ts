import { Component } from '@angular/core';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService } from '../../services/poll.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.scss'
})
export class CreatePollComponent {
  cryptocurrencies: Cryptocurrency[] = [];
  selectedCurrencyId: string = '';
  question: string = '';
  options: { value: string }[] = [];
  correctAnswerIndex: number = 0;

  constructor(
    private cryptocurrencyService: CryptocurrencyListService,
    private pollService: PollService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCryptocurrencies();
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

  addOption(): void {
    this.options.push({ value: '' });
  }

  removeOption(index: number): void {
    this.options.splice(index, 1);
  }

  createPoll(): void {
    const pollData = {
      question: this.question,
      options: this.options.map(option => option.value),
      correctAnswerIndex: this.correctAnswerIndex,
      topic: this.selectedCurrencyId
    };

    this.pollService.createPoll(pollData).subscribe(
      response => {
        this.toastr.success('Anketa je uspješno kreirana!', 'Uspjeh');
        this.router.navigate(['/admin-dashboard']);
      },
      error => {
        this.toastr.error('Greška pri kreiranju ankete.', 'Greška');
      }
    );
  }
}