import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: 'user', component: UserComponent
  }, {
    path: 'admin', component: AdminComponent
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
