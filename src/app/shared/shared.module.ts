import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormSubmittedEvent, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from '../NgZorroAntdModule';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    RouterOutlet,
    NgZorroAntdModule

  ],
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    RouterOutlet,
    NgZorroAntdModule
  ]
})
export class SharedModule { }
