
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LivePricesService {
    constructor(private http: HttpClient) { }

    getBitcoinData(): Observable<any> {
        const url = "https://api.livecoinwatch.com/coins/single";
        const headers = {
            'content-type': 'application/json',
            'x-api-key': 'e35856aa-bf0e-48bd-aa72-28922f418e2e'
        };
        const body = {
            currency: "USD",
            code: "BTC",
            meta: true
        };

        return this.http.post(url, body, { headers });
    }
}
