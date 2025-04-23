import { HttpClient, HttpHeaders } from '@angular/common/http';
//HttpClient:pour faire des appels HTTP
import { Injectable } from '@angular/core';
//Injectable : indiquer que ce service  sera injecté dans d'autres componenet
import { Observable, of } from 'rxjs';
//observable: gerer des reponses asynchrones
//
import { catchError, map } from 'rxjs/operators';
//tchError, map : des operateurs pour transformer les donnes  et gerer les erreur
import { throwError } from 'rxjs';

interface AdminData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  gender: string;
}
interface ApiResponse {
  success: boolean;
  message: string;
  admin: any;
  errors?: any;
}

@Injectable({
  providedIn: 'root'
}) // rend service disponible partout dans l'app : pas besoin de le declarer dans un module
export class AdminListService {
  private apiUrl = 'http://localhost:8000/api/admins';
  //url vers le backend  

  constructor(private http: HttpClient) {}



  getAdmins(): Observable<any[]> { /* retoune observale contenant tab d'element (les admins)*/
    
    //verifier l'existence du token dans local storage
     const token = localStorage.getItem('token_sanctum');
    if (!token) {
      console.error('Token manquant');
      return of([]);
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      //obligatoire pour les envoyes dans le en tetes de la requete get
    });

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      // faire une requete Get vers 'apiUrl' avec les headers
      //pipe: faire des traitements sur la reponse
      map(response => {
        /*but est renvoyé un tab toujour 
         si response est deja un table --> retourne le 
         et si la reponse est  objet qui contient une clé data on retorune : response.data
         et si ni tableau ni objet avec data donc enveloppe le dans un tab */
        return Array.isArray(response) ? response : 
               response.data ? response.data : 
               [response];
      }),
      catchError(err => {
        console.error('Erreur API:', err);
        return of([]);
        //en cas d'erreur : echec de requete : retourne un tab vide
      })
    );
  }
  //scenario: 
/* Ton composant appelle getAdmins() au démarrage.

Le service vérifie s’il y a un token dans le navigateur.

Il construit une requête GET avec un header Authorization.

L’API Laravel répond avec un objet contenant la liste des admins.

Le map() adapte la réponse pour renvoyer un tableau d’administrateurs propre.

Ton composant les affiche dans le tableau.*/
  


  updateStatus(adminId: number, status: string): Observable<any> {
    const token = localStorage.getItem('token_sanctum');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put(
      `${this.apiUrl}/updateStatus/${adminId}`, 
      { status },
      { headers }
    );
  }

  getAdminById(adminId:number):Observable<any>{
    const token = localStorage.getItem('token_sanctum');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      //obligatoire pour les envoyes dans le en tetes de la requete get
    });
    return this.http.get(`${this.apiUrl}/${adminId}`, { headers });
  }

  
  addAdmin(adminData: AdminData) {
    const token = localStorage.getItem('token_sanctum');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      //obligatoire pour les envoyes dans le en tetes de la requete get
    });
    return this.http.post<ApiResponse>(`${this.apiUrl}/add`, adminData , {headers}).pipe(
      catchError(error => {
        if (error.status === 422) {
          // Gestion des erreurs de validation
          return throwError(() => error.error.errors);
        }
        return throwError(() => 'Une erreur est survenue');
      })
    );
  }

  updateAdmin(adminId: number, adminData: AdminData) {
    const token = localStorage.getItem('token_sanctum');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
        //obligatoire pour les envoyes dans le en tetes de la requete get
      });
    return this.http.put<ApiResponse>(`${this.apiUrl}/update/${adminId}`, adminData, { headers }).pipe(
      catchError(error => {
        if (error.status === 422) {
          // Gestion des erreurs de validation
          return throwError(() => error.error.errors);
        }
        return throwError(() => 'Une erreur est survenue');
      })
    );
    


}
}