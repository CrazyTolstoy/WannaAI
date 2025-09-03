import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<any>('https://api.artivagency.com/api/auth/login', {
      username: email,
      password
    }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    console.log(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Payload = token.split('.')[1];

      // Decode base64 to binary string
      const binary = atob(base64Payload);

      // Convert binary string to Uint8Array
      const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));

      // Decode UTF-8 string
      const payloadJson = new TextDecoder('utf-8').decode(bytes);
      const payload = JSON.parse(payloadJson);

      console.log(payload);
      // Assuming 'email' is the key in your JWT payload
      return payload.email || null;
    } catch (err) {
      console.error('Token parsing failed for email:', err);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/']);
  }

  register(user: { fullName: string, email: string, password: string }) {
    return this.http.post('/api/auth/register', user);
  }

}
