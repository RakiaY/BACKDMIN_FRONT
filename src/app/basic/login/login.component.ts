import { Component , OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../basic-service/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  imports: [ SharedModule  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!:FormGroup; // le groupe des champs du formulaire
  router: any;
  
  constructor(private fb:FormBuilder , private authService: AuthService , private message: NzMessageService /*service pour afficher les erreurs */) { 
   }
  
   onSubmit() {
    this.authService.loginUser(this.loginForm).subscribe({
      next: (response: { token: string; }) => {
        // Stockez le token reçu du backend
        localStorage.setItem('token_sanctum', response.token); // <-- ICI
        this.router.navigate(['/admin']); // Redirection après login
      },
      error: (error) => {
        console.error('Erreur de connexion', error);
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null,[Validators.required]],

      password: [null,[Validators.required]],

      remember: [true]}
    ); //case coché par defaut
  }
 
  submitForm() {
    this.authService.loginUser(this.loginForm.value).subscribe(res=>{
      console.log(res);
    },
      
      
      errors=>{
        this.message.error("Login ou mot de passe incorrect"), { nzDuration : 2000 };

    })

}
}