import { Component } from '@angular/core';
import { LivePricesComponent } from '../live-prices/live-prices.component';
import { ListOfCoinsComponent } from '../list-of-coins/list-of-coins.component';

@Component({
  selector: 'app-guest-home',
  standalone: true,
  imports: [LivePricesComponent, ListOfCoinsComponent],
  templateUrl: './guest-home.component.html',
  styleUrl: './guest-home.component.scss'
})
export class GuestHomeComponent { }
