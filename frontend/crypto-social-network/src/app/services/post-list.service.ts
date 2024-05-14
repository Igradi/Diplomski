import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    selectedTopic: string = '';

    constructor(private http: HttpClient, private userService: UserService) { }

    getAllPosts(): Observable<Post[]> {
        return this.http.get<Post[]>('http://localhost:4000/api/posts/getAllPosts');
    }

    upvotePost(postId: string): Observable<any> {
        return this.http.put<any>(`http://localhost:4000/api/posts/${postId}/upvote`, {});
    }

    downvotePost(postId: string): Observable<any> {
        return this.http.put<any>(`http://localhost:4000/api/posts/${postId}/downvote`, {});
    }

    createPost(content: string, topic: string): Observable<any> {
        const user = this.userService.getUserIdFromToken();
        return this.http.post<any>('http://localhost:4000/api/posts/createPost', { content, topic, user });
    }

}
