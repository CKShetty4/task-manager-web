import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService, private router: Router, private http: HttpClient)  { }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(), 
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token') || '', res.headers.get('x-refresh-token') || '');
        console.log("LOGGED IN!");
      })
    )
  }

  signup(email: string, password: string) {
    return this.webService.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token') || '', res.headers.get('x-refresh-token') || '');
        console.log("Successfully signed up and now logged in!");
      })
    )
  } 

  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }

  private isBrowser() {
    return typeof window !== 'undefined'; 
  }

  getAccessToken() {
    const token = this.isBrowser() ? localStorage.getItem('x-access-token') : null;
    console.log("Retrieved Access Token:", token); 
    return token;
  }

  getRefreshToken() {
    return this.isBrowser() ? localStorage.getItem('x-refresh-token') || '' : '';
  }

  getUserId(): string | null {
    return this.isBrowser() ? localStorage.getItem('user-id') : null;
  }

  setAccessToken(accessToken: string) {
    if (this.isBrowser()) {localStorage.setItem('x-access-token', accessToken)}
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    if (this.isBrowser()) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
    }
  }
  private removeSession() {
    if (this.isBrowser()) {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
    }
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId() || ''
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token')!);  
      })
    )
  }
}
