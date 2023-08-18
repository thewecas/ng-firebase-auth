import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe({
      next: (user) => {
        // this.isAuthenticated = !user ? false : true; 
        this.isAuthenticated = !!user;
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
