import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';






@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,
    RouterLink,
    RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() collapsed = false;
  @Input() mobileOpen = false;

  constructor(private router: Router) { }

  onToggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  get exam(): string {
    return localStorage.getItem('selectedExam') || 'neet';
  }


}
