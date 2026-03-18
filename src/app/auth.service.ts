import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'pronet_auth_token';
  private readonly authUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const body = { username, password };

    return this.http.post<unknown>(this.authUrl, body).pipe(
      map((res: any) => {
        const token = res?.token ?? res?.jwt ?? res?.accessToken;
        if (!token) {
          throw new Error('No se recibió token de la API.');
        }
        localStorage.setItem(this.storageKey, token);
        return token as string;
      }),
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 401 || error.status === 400
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo conectar con el servidor de autenticación.';
        return throwError(() => new Error(message));
      })
    );
  }

  get token(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}
