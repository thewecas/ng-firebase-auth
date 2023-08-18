import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { TweetsComponent } from './tweets/tweets.component';
import { UserComponent } from './user/user.component';



const routes: Routes = [
  {
    path: 'user', component: UserComponent, canActivate: [AuthGuard]
  }, {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard]
  },
  {
    path: 'posts', component: TweetsComponent
  },
  {
    path: "auth", component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
