import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  imports: [CommonModule,
    RouterModule
],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
})
export class MobileMenu {

  constructor(private router: Router){}

  navigate(url:string){
    this.router.navigateByUrl(url);
  }
}
