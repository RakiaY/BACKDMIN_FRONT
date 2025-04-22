import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,
    NzButtonModule,
    NzFormModule,
    NzInputModule

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {



  title = 'sitmypet-frontend';
}

