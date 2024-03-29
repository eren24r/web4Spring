import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(TOKEN_KEY);
    }else {
      return null;
    }
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const userString = sessionStorage.getItem(USER_KEY);
      return userString ? JSON.parse(userString) : null;
    }
    return null;
  }

  logOut(): void {
    window.sessionStorage.clear();
    window.location.reload();
  }
}
