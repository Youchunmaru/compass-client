import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  get(name: string): string {
    const ca: string[] = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  set(name: string, value: string, expireDays: number = 7, path: string = '/'): void {
    let expires = '';
    if (expireDays) {
      const date = new Date();
      date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    //todo Note: In production, add 'Secure' and 'SameSite=Strict' flags.
    // document.cookie = `${name}=${value}${expires}; path=${path}; Secure; SameSite=Strict`;
    document.cookie = `${name}=${value}${expires}; path=${path}`;
  }

  delete(name: string, path: string = '/'): void {
    this.set(name, '', -1, path);
  }
}
