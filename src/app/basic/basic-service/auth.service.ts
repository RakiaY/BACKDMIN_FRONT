import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

const baseUrl = "http://localhost:8000";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  
  loginUser(loginData: any): Observable<any> {
    return this.http.post(baseUrl + "/api/login", loginData).pipe(
      tap((response: any) => {
        // Stockage du token dans localStorage
        localStorage.setItem('token_sanctum', response.token);
        
        // Optionnel : Stockage des infos utilisateur
        localStorage.setItem('current_user', JSON.stringify(response.user));
      })
    );
  }

  // Méthode utilitaire pour récupérer le token (utile pour les autres services)
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Méthode pour vérifier si l'utilisateur est connecté (optionnelle mais utile)
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}