import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cryptocurrency } from '../models/cryptocurrency.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class CryptocurrencyListService {

    constructor(private http: HttpClient, private userService: UserService) { }

    getAllCryptocurrencies(): Observable<Cryptocurrency[]> {
        return this.http.get<Cryptocurrency[]>('http://localhost:4000/api/currencies/getAllCurrencies', { headers: this.userService.generateHeaders() });
    }

    toggleFavoriteCryptocurrency(currencyId: string, userId: string): Observable<any> {
        return this.http.post<any>('http://localhost:4000/api/currencies/favoriteCurrency', { currencyId, userId }, { headers: this.userService.generateHeaders() });
    }

}
