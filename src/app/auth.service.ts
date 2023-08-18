import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './auth/user.model';

export interface AuthResponseData {
  kind?: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  token: string;
  tokenExpirationTimer: any;


  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDfOAGn-UHw7zdDXXb07Nt2X8SFLuZcucs',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(catchError(this.handleError), tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)));
  }


  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDfOAGn-UHw7zdDXXb07Nt2X8SFLuZcucs',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(catchError(this.handleError), tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)));
  }


  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData)
      return;

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.user.next(loadedUser);
    }

  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errResponse: HttpErrorResponse) {
    console.log(errResponse);

    let errorMessage: string;
    if (errResponse.error && errResponse.error.error) {
      switch (errResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This Email exists already'; break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This Email does not exist'; break;
        case 'INVALID_PASSWORD':
          errorMessage = 'Invalid Password'; break;
        case 'USER_DISABLED':
          errorMessage = 'Your Account is disabled'; break;
        default:
          errorMessage = 'An Unknown error occurred';
      }
    }
    return throwError(() => errorMessage);
  }


  private handleAuthentication(
    email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    this.token = user.token;
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
