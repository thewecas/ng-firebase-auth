import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss']
})
export class TweetsComponent {
  title = '';
  content = '';
  posts = [];
  isAuthenticated: boolean = false;
  userSub: Subscription;
  isFetching: boolean = false;
  error: string | null = null;
  errorSubscription: Subscription;
  constructor(private postService: PostService, private authService: AuthService) {

  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe({
      next: (user) => {
        // this.isAuthenticated = !user ? false : true; 
        this.isAuthenticated = !!user;
      }
    });
    this.fetchPost();
    this.errorSubscription = this.postService.error.subscribe(res => this.error = res);

  }


  createPost(postData: Post) {

    //send http post request
    this.postService.createAndStorePost(postData);
    //clear the form
    this.title = '';
    this.content = '';
  }

  fetchPost() {
    this.isFetching = true;

    //fetch the posts from the server
    this.postService
      .fetchPost()
      .subscribe({
        next: (res) => {
          this.posts = res;
          this.isFetching = false;
        },
        error: (err) => {
          this.error = err.message;
          this.isFetching = false;
        },
      });
  }

  clearPost() {
    this.postService.clearPost().subscribe({
      next: (res) => {
        this.posts = [];
      },
      error: (err) => this.error = err.status + " " + err.statusText


    });
  }

  handleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.userSub.unsubscribe();
  }
}
