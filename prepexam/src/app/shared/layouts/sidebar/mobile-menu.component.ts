import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent {
  private router = inject(Router);

  get exam(): string {
    return localStorage.getItem('selectedExam') || 'neet';
  }

  menuItems = [
    { label: 'Dashboard', icon: 'fas fa-home', route: 'dashboard', badge: 0 },
    { label: 'Assessment', icon: 'fas fa-clipboard-check', route: 'assessment', badge: 0 },
    { label: 'Mock Test', icon: 'fas fa-file-alt', route: 'mock', badge: 0 },
    { label: 'Leaderboard', icon: 'fas fa-trophy', route: 'leaderboard', badge: 0 },
    { label: 'Reports', icon: 'fas fa-chart-bar', route: 'reports', badge: 3 },
  ];

  navigate(route: string): void {
    this.router.navigate(['/', this.exam, route]);
  }

  isActive(route: string): boolean {
    const url = this.router.url;
    if (route === 'dashboard') {
      return url.endsWith('/dashboard') || url.endsWith('/' + this.exam);
    }
    return url.includes('/' + route);
  }
}
