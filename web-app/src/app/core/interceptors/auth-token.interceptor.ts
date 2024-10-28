import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthorizationService);
  const snackBar = inject(MatSnackBar); 
  const token = authService.getToken();

  let clonedRequest = req;
  if (token && !req.url.endsWith('/api/login')) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        snackBar.open('Sua sessão expirou. Faça login novamente.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};