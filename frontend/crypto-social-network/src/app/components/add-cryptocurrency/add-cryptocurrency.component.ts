import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-cryptocurrency',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-cryptocurrency.component.html',
  styleUrl: './add-cryptocurrency.component.scss'
})
export class AddCryptocurrencyComponent {
  currencyForm: FormGroup;

  constructor(private fb: FormBuilder, private currencyService: CryptocurrencyListService, private toastr: ToastrService) {
    this.currencyForm = this.fb.group({
      name: ['', Validators.required],
      abbreviation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]]
    });
  }

  onSubmit() {
    if (this.currencyForm.valid) {
      this.currencyService.createCurrency(this.currencyForm.value).subscribe(response => {
        this.toastr.success('Currency added successfully!', 'Success');
      }, error => {
        this.toastr.error('Failed to add currency. Please try again later.', 'Error');
      });
    }
  }
}