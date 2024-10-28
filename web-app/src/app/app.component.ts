import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ColaboraIF';

  constructor(
  ) {

  }

  ngOnInit() {
    
  }

}


 
