import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        return this.http.get<Post[]>('http://localhost:4000/api/posts/getAllPosts', { headers: this.userService.generateHeaders() });
    }

    getPostById(postId: string): Observable<Post> {
        return this.http.get<Post>(`http://localhost:4000/api/posts/${postId}`, { headers: this.userService.generateHeaders() });
    }

    updatePost(postId: string, content: string): Observable<any> {
        return this.http.put<any>(`http://localhost:4000/api/posts/updatePost/${postId}`, { content }, { headers: this.userService.generateHeaders() });
    }

    upvotePost(postId: string): Observable<any> {
        return this.http.put<any>(`http://localhost:4000/api/posts/${postId}/upvote`, {}, { headers: this.userService.generateHeaders() });
    }

    downvotePost(postId: string): Observable<any> {
        return this.http.put<any>(`http://localhost:4000/api/posts/${postId}/downvote`, {}, { headers: this.userService.generateHeaders() });
    }

    createPost(content: string, topic: string): Observable<any> {
        const user = this.userService.getUserIdFromToken();
        return this.http.post<any>('http://localhost:4000/api/posts/createPost', { content, topic, user }, { headers: this.userService.generateHeaders() });
    }

    deletePost(postId: string): Observable<any> {
        return this.http.delete<any>(`http://localhost:4000/api/posts/deletePost/${postId}`, { headers: this.userService.generateHeaders() });
    }

}
