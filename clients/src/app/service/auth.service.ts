import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:32355/web4/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signing', {
      username: user.username,
      password: user.password
    });
  }

  public register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }
}
