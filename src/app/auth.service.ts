import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { ApiResponse } from './products/data-access/product.model';

interface LoginResponse {
  token: string;
  expiration: string;
  username: string;
  email: string;
}

interface UserProfile {
  username: string;
  email: string;
  token: string;
  tokenExpiration: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  get currentUser$(): Observable<UserProfile | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUserValue?.token || null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/token`, { email, password }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Invalid login response');
        }
        return response.data;
      }),
      tap(response => {
        if (!response.token || !response.expiration) {
          throw new Error('Invalid token data');
        }
        
        const userProfile: UserProfile = {
          username: response.username,
          email: response.email,
          token: response.token,
          tokenExpiration: new Date(response.expiration)
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userProfile));
        this.currentUserSubject.next(userProfile);
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        throw error;
      })
    );
  }

  register(username: string, firstname: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/account`, { username, firstname, email, password });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    console.log('Current user:', user);
    if (!user || !user.token) return false;
    
    // Vérifier si le token est expiré
    return new Date(user.tokenExpiration) > new Date();
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      console.log('Decoded token payload:', decoded);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

// isAdmin(): boolean {
//   //if (!this.isAuthenticated()) return false;
  
//   // Solution 1: Comparaison case-sensitive
//   // return this.currentUserValue?.email === 'admin@admin.com';
  
//   // Solution 2: Comparaison case-insensitive (plus robuste)
//   //return this.currentUserValue?.email?.toLowerCase() === 'admin@admin.com';
//   return true; // Pour le test, on retourne true pour simuler un admin
// }

isAdmin(): boolean {
  // return true; // Simulation permanente
  return environment.mockAdmin; // Mieux : contrôlé par l'environnement
}
}