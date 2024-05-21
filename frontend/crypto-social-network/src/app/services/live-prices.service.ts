import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Cryptocurrency } from '../models/cryptocurrency.model';

@Injectable({
    providedIn: 'root'
})
export class LivePricesService {
    constructor(private http: HttpClient, private userService: UserService) { }

    private getCryptoData(code: string): Observable<any> {
        const url = "https://api.livecoinwatch.com/coins/single";
        const headers = {
            'content-type': 'application/json',
            'x-api-key': 'e35856aa-bf0e-48bd-aa72-28922f418e2e'
        };
        const body = {
            currency: "USD",
            code: code,
            meta: true
        };

        return this.http.post(url, body, { headers });
    }

    private getCryptoHistory(code: string): Observable<any> {
        const url = "https://api.livecoinwatch.com/coins/single/history";
        const headers = {
            'content-type': 'application/json',
            'x-api-key': 'e35856aa-bf0e-48bd-aa72-28922f418e2e'
        };
        const body = {
            currency: "USD",
            code: code,
            start: Date.now() - 365 * 24 * 60 * 60 * 1000,
            end: Date.now(),
            meta: true
        };

        return this.http.post(url, body, { headers });
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
}
