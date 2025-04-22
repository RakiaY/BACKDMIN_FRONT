import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Admin {
  id: number; 
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: Gender;
  phone: string;
  status: AdminStatus;
}
type AdminStatus = 'Active' | 'Inactive' | 'Suspended';

enum Gender {
  Male = 'male',
  Female = 'female'
}


@Injectable({ providedIn: 'root' })
export class AdminManageService {
  private baseUrl = "http://localhost:8000/api/admins";
  AuthService: any;

  constructor(private http: HttpClient , 
    private authService: AuthService
  ) {}

  private getHeaders() {
    const token = localStorage.getItem('token_sanctum');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.baseUrl, { 
      headers: this.getHeaders() 
    });
  }

  getAdminById(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  addAdmin(admin: Omit<Admin, 'id'>): Observable<Admin> {
    return this.http.post<Admin>(`${this.baseUrl}/add`, admin, { headers: this.getHeaders() });
  }

  updateAdmin(id: number, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.baseUrl}/update/${id}`, admin, { headers: this.getHeaders() });
  }

  updateStatus(id: number, status: Admin['status']): Observable<Admin> {
    return this.http.put<Admin>(`${this.baseUrl}/updateStatus/${id}`, { status }, { headers: this.getHeaders() });
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}