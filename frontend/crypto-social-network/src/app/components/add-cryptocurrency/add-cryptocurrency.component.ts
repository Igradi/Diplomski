import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CryptocurrencyListService } from '../../services/cryptocurrency-list.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-cryptocurrency',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-cryptocurrency.component.html',
  styleUrls: ['./add-cryptocurrency.component.scss']
})
export class AddCryptocurrencyComponent {
  currencyForm: FormGroup;
  currencies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private currencyService: CryptocurrencyListService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.currencyForm = this.fb.group({
      name: ['', Validators.required],
      abbreviation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.currencyService.getAllCryptocurrencies().subscribe(
      (currencies) => {
        this.currencies = currencies;
      },
      (error) => {
        this.toastr.error('Failed to load currencies. Please try again later.', 'Error');
      }
    );
  }

  onSubmit() {
    if (this.currencyForm.valid) {
      this.currencyService.createCurrency(this.currencyForm.value).subscribe(response => {
        this.toastr.success('Currency added successfully!', 'Success');
        this.loadCurrencies();
        this.currencyForm.reset();
      }, error => {
        this.toastr.error('Failed to add currency. Please try again later.', 'Error');
      });
    }
  }

  deleteCurrency(currencyId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this currency?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.currencyService.deleteCurrency(currencyId).subscribe(
          () => {
            this.currencies = this.currencies.filter(currency => currency._id !== currencyId);
            this.toastr.success('Currency deleted successfully!', 'Success');
            Swal.fire('Deleted!', 'The currency has been deleted.', 'success');
          },
          (error) => {
            this.toastr.error('Failed to delete currency. Please try again later.', 'Error');
            Swal.fire('Error!', 'There was an error deleting the currency.', 'error');
          }
        );
      }
    });
  }
}
