import { Component } from '@angular/core';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService } from '../../services/poll.service';

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
  options: string[] = [];
  correctAnswerIndex: number = 0;

  constructor(private cryptocurrencyService: CryptocurrencyListService, private pollService: PollService) { }

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
    this.options.push('');
  }

  removeOption(index: number): void {
    this.options.splice(index, 1);
  }

  createPoll(): void {
    // Implement your logic to create a poll
  }

}