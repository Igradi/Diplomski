import { Component } from '@angular/core';
import { LivePricesComponent } from '../live-prices/live-prices.component';

@Component({
  selector: 'app-guest-home',
  standalone: true,
  imports: [LivePricesComponent],
  templateUrl: './guest-home.component.html',
  styleUrl: './guest-home.component.scss'
})
export class GuestHomeComponent {

}
