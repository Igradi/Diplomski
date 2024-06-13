import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Cryptocurrency } from '../models/cryptocurrency.model';

@Injectable({
    providedIn: 'root'
})
export class LivePricesService {
    private apiUrl = 'https://api.livecoinwatch.com/coins/single';
    private apiHistoryUrl = 'https://api.livecoinwatch.com/coins/single/history';
    private apiKey = 'e35856aa-bf0e-48bd-aa72-28922f418e2e';
    private headers = {
        'content-type': 'application/json',
        'x-api-key': this.apiKey
    };

    private selectedCoinSubject = new Subject<string>();
    selectedCoin$ = this.selectedCoinSubject.asObservable();

    constructor(private http: HttpClient, private userService: UserService) { }

    private getCryptoData(code: string): Observable<any> {
        const body = {
            currency: "USD",
            code: code,
            meta: true
        };
        return this.http.post(this.apiUrl, body, { headers: this.headers });
    }

    private getCryptoHistory(code: string): Observable<any> {
        const body = {
            currency: "USD",
            code: code,
            start: Date.now() - 365 * 24 * 60 * 60 * 1000,
            end: Date.now(),
            meta: true
        };
        return this.http.post(this.apiHistoryUrl, body, { headers: this.headers });
    }

    getFavoriteCryptosData(): Observable<any[]> {
        return this.userService.getUserByIdFromToken().pipe(
            switchMap((user: User) => {
                const requests = user.favorites.map((favoriteId: string) => {
                    return this.http.get<Cryptocurrency>(`http://localhost:4000/api/currencies/${favoriteId}`, { headers: this.userService.generateHeaders() }).pipe(
                        switchMap((crypto: Cryptocurrency) => forkJoin({
                            data: this.getCryptoData(crypto.abbreviation),
                            history: this.getCryptoHistory(crypto.abbreviation)
                        }))
                    );
                });
                return forkJoin(requests);
            })
        );
    }

    getAllCryptosData(): Observable<any[]> {
        return this.http.get<Cryptocurrency[]>('http://localhost:4000/api/currencies/getAllCurrencies').pipe(
            switchMap((cryptos: Cryptocurrency[]) => {
                const requests = cryptos.map((crypto: Cryptocurrency) => {
                    return forkJoin({
                        data: this.getCryptoData(crypto.abbreviation),
                        history: this.getCryptoHistory(crypto.abbreviation)
                    });
                });
                return forkJoin(requests);
            })
        );
    }

    getCryptoByAbbreviation(abbreviation: string): Observable<any> {
        return forkJoin({
            data: this.getCryptoData(abbreviation),
            history: this.getCryptoHistory(abbreviation)
        });
    }

    selectCoin(abbreviation: string) {
        this.selectedCoinSubject.next(abbreviation);
    }
}
