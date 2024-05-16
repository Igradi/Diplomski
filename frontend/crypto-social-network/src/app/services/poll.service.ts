import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll } from '../models/poll.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class PollService {

    constructor(private http: HttpClient, private userService: UserService) { }

    getAllPolls(): Observable<Poll[]> {
        return this.http.get<Poll[]>('http://localhost:4000/api/polls/getAllPolls', { headers: this.userService.generateHeaders() });
    }

    getPollById(pollId: string): Observable<Poll> {
        return this.http.get<Poll>(`http://localhost:4000/api/polls/${pollId}`, { headers: this.userService.generateHeaders() });
    }

    createPoll(pollData: any): Observable<any> {
        return this.http.post<any>('http://localhost:4000/api/polls/createPoll', pollData, { headers: this.userService.generateHeaders() });
    }

    deletePoll(pollId: string): Observable<any> {
        return this.http.delete<any>(`http://localhost:4000/api/polls/deletePoll/${pollId}`, { headers: this.userService.generateHeaders() });
    }
}
