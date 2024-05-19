import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private baseUrl: string = 'http://localhost:4000/api/comments';

    constructor(private http: HttpClient, private userService: UserService) { }

    createComment(postId: string, content: string): Observable<any> {
        const userId = this.userService.getUserIdFromToken();
        return this.http.post<any>(`http://localhost:4000/api/posts/${postId}/comments`, { content, user: userId }, { headers: this.userService.generateHeaders() });
    }

    getComments(postId: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`http://localhost:4000/api/posts/${postId}/comments`, { headers: this.userService.generateHeaders() });
    }

    deleteComment(commentId: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/deleteComment/${commentId}`, { headers: this.userService.generateHeaders() });
    }

    editComment(commentId: string, content: string): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/updateComment/${commentId}`, { content }, { headers: this.userService.generateHeaders() });
    }

    getCommentById(commentId: string): Observable<Comment> {
        return this.http.get<Comment>(`${this.baseUrl}/${commentId}`, { headers: this.userService.generateHeaders() });
    }
}
