import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cryptocurrency } from '../models/cryptocurrency.model';

@Injectable({
    providedIn: 'root'
})
export class CryptocurrencyListService {

    constructor(private http: HttpClient) { }

    getAllCryptocurrencies(): Observable<Cryptocurrency[]> {
        return this.http.get<Cryptocurrency[]>('http://localhost:4000/api/currencies/getAllCurrencies');
    }

}
