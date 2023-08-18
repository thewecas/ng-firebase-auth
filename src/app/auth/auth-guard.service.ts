import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { take, tap } from "rxjs";
import { AuthService } from "../auth.service";

export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.user.pipe(take(1), tap(user => {
    return !!user ? true : router.navigate(['/auth']);
  }));
};
