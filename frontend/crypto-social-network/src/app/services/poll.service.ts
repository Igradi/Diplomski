import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll } from '../models/poll.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class PollService {
    private baseUrl: string = 'http://localhost:4000/api/polls';

    constructor(private http: HttpClient, private userService: UserService) { }

    getAllPolls(): Observable<Poll[]> {
        return this.http.get<Poll[]>(`${this.baseUrl}/getAllPolls`, { headers: this.userService.generateHeaders() });
    }

    getPollById(pollId: string): Observable<Poll> {
        return this.http.get<Poll>(`${this.baseUrl}/${pollId}`, { headers: this.userService.generateHeaders() });
    }

    createPoll(pollData: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/createPoll`, pollData, { headers: this.userService.generateHeaders() });
    }

    deletePoll(pollId: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/deletePoll/${pollId}`, { headers: this.userService.generateHeaders() });
    }

    submitVotes(pollId: string, votes: { questionIndex: number, selectedOptionIndex: number }[], userId: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/votePoll/${pollId}`, { votes, userId }, { headers: this.userService.generateHeaders() });
    }
}
