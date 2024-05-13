import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(private http: HttpClient) { }

    getAllPosts(): Observable<Post[]> {
        return this.http.get<Post[]>('http://localhost:4000/api/posts/getAllPosts');
    }

    upvotePost(postId: string): Observable<any> {
        return this.http.put<any>(`http://localhost:4000/api/posts/${postId}/upvote`, {});
    }

    downvotePost(postId: string): Observable<any> {
        return this.http.put<any>(`http://localhost:4000/api/posts/${postId}/downvote`, {});
    }

}