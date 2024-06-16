import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  constructor(
    private http: HttpClient,
    private router: Router
  ) {} /* , private router: Route */

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  login2(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuth(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  /*  {
    "name": "Marcelo",
    "email": "marceloTeacher@gmail.com",
    "age": 24,
    "phoneNumber": "74613450",
    "password": "1234",
    "role": "ADMIN"
} */
  registerUser(
    name: string,
    email: string,
    age: number,
    phoneNumber: number,
    password: string,
    role: string
  ): Observable<any> {
    const roleUrl =role == 'ADMIN'?'register':'teacher' ; 
    return this.http
      .post<any>(`${this.apiUrl}/auth/${roleUrl}`, {
        name,
        email,
        age,
        phoneNumber,
        password,
        role,
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }
}
