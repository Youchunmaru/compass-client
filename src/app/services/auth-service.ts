import {computed, inject, Injectable, signal} from '@angular/core';
import {CookieService} from './cookie-service';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly LOGIN_ROUTE = '/login';
  private readonly HOME_ROUTE = '/';
  private _currentUser = signal<User | null>(null);

  public currentUser = this._currentUser.asReadonly();

  public isLoggedIn = computed(() => !!this._currentUser());

  constructor() {
    this.checkInitialSession();
  }

  getToken(): string {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  login(credentials: { username: string, password: string }): Observable<AuthResponse> {
    const loginUrl = '/api-auth/login';
    console.log('loginUrl', loginUrl);
    return this.http.post<AuthResponse>(loginUrl, credentials).pipe(
      tap(response => {
        console.log('response', response);
        this.cookieService.set(this.TOKEN_KEY, response.token);
        this._currentUser.set(response.user);
        this.router.navigate([this.HOME_ROUTE]);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this._currentUser.set(null);
    this.router.navigate([this.LOGIN_ROUTE]);
    // todo might also want to call a /api/auth/logout endpoint
    // this.http.post('/api-auth/logout', {}).subscribe();
  }

  private checkInitialSession(): void {
    const token = this.getToken();
    if (token) {
      const profileUrl = '/api-auth/login/validate';

      this.http.get<User>(profileUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).pipe(
        catchError(() => {
          this.logout();
          return throwError(() => new Error('Invalid session'));
        })
      ).subscribe(user => {
        this._currentUser.set(user);
      });
    }
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
