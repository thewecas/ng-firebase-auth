import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })

export class PostService {

  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(postData: Post) {
    this.http
      .post<{ name: string; }>(
        'https://ng-http-30d0b-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => this.error.next(err.message),
      });
  }


  fetchPost() {
    return this.http
      .get<{ [key: string]: Post; }>('https://ng-http-30d0b-default-rtdb.firebaseio.com/posts.json')
      .pipe(
        catchError(errorRes => throwError(() => errorRes)),
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) if (responseData.hasOwnProperty(key))
            postsArray.push({ ...responseData[key], id: key });
          return postsArray;
        }));
  }


  clearPost() {
    return this.http
      .delete('https://ng-http-30d0b-default-rtdb.firebaseio.com/posts.json',);
  }
}