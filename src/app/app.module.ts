import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgZorroAntdModule } from './NgZorroAntdModule';  // Assure-toi que Ng-Zorro est importé ici
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AdminManagementComponent } from './basic/admin-management/admin-management.component';
import { LoginComponent } from './basic/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app.routes';
import { CommonModule } from '@angular/common';
import { AdminListComponent } from './basic/admin-list/admin-list.component';



@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule ,
    NzFormModule,
    NzInputModule ,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NzModalModule ,
    CommonModule , 
    FormsModule,
    ReactiveFormsModule,
    AppComponent // Importing the standalone component
  ],
  providers: [NzMessageService],
  bootstrap: []  // Le composant principal pour démarrer l'app
})
export class AppModule { }
