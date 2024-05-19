import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient, private userService: UserService) { }

    createComment(postId: string, content: string): Observable<any> {
        const userId = this.userService.getUserIdFromToken();
        return this.http.post<any>(`http://localhost:4000/api/posts/${postId}/comments`, { content, user: userId }, { headers: this.userService.generateHeaders() });
    }

    getComments(postId: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`http://localhost:4000/api/posts/${postId}/comments`, { headers: this.userService.generateHeaders() });
    }
}
