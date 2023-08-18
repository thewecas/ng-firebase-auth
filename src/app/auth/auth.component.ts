import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {

  isLoginMode: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.error = null;
    if (!form.valid)
      return;
    const email = form.value.email;
    const password = form.value.password;


    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode)
      authObs = this.authService.login(email, password);
    else
      authObs = this.authService.signup(email, password);

    authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/posts']);
      },
      error: (errResponse) => {
        console.error(errResponse);
        this.error = errResponse;
        this.isLoading = false;
      },
    });

    form.reset();

  }

}
