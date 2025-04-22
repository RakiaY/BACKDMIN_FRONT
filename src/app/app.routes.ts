import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './basic/login/login.component';
import { AdminManagementComponent } from './basic/admin-management/admin-management.component';
import { NgModule } from '@angular/core';
import { AdminListComponent } from './basic/admin-list/admin-list.component';

export const routes: Routes = [
    { path: "", component: LoginComponent },  // Route par défaut (login)
    { path: "admin", component: AdminManagementComponent }, // Nouvelle route pour l'admin
    { path: 'admin-list', component: AdminListComponent },
    { path: "**", redirectTo: "" } // Redirige les URLs inconnues vers le login
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
