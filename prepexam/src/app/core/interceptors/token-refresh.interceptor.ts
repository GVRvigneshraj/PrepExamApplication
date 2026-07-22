import { HttpEvent, HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../services/storage.service';
import { AuthEndpoints } from '../api/endpoints/auth.endpoint';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storage = inject(StorageService);

  if (isAuthEndpoint(req.url)) {
    return next(req) as Observable<HttpEvent<unknown>>;
  }

  const token = storage.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.hasRefreshToken()) {
        return handle401Error(req, next, authService, storage);
      }
      return throwError(() => error);
    })
  ) as Observable<HttpEvent<unknown>>;
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  storage: StorageService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((res) => {
        if (res.success && res.data?.token) {
          refreshTokenSubject.next(res.data.token);
          const clonedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${res.data.token}` }
          });
          return next(clonedReq);
        }
        authService.logout();
        return throwError(() => new Error('Token refresh failed'));
      }),
      catchError((err) => {
        authService.logout();
        return throwError(() => err);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(clonedReq);
      })
    );
  }
}

function isAuthEndpoint(url: string): boolean {
  const authUrls = [
    AuthEndpoints.LOGIN,
    AuthEndpoints.REGISTER,
    AuthEndpoints.REFRESH_TOKEN,
    AuthEndpoints.FORGOT_PASSWORD,
    AuthEndpoints.RESET_PASSWORD,
  ];
  return authUrls.some((authUrl) => url.includes(authUrl));
}
