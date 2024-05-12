import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private http: HttpClient) { }

    createComment(postId: string, content: string): Observable<any> {
        return this.http.post<any>(`http://localhost:4000/api/posts/${postId}/comments`, { content });
    }

}
