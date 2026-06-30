import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../../features/dashboard/shared/header/header';
import { Sidebar } from '../../features/dashboard/shared/sidebar/sidebar';
import { MobileMenu } from '../../features/dashboard/shared/mobile-menu/mobile-menu';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Sidebar, MobileMenu],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isProfilePanelOpen = false;
  isNotificationsPanelOpen = false;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      this.isSidebarCollapsed = false;
      this.isProfilePanelOpen = false;
      this.isNotificationsPanelOpen = false;
      return;
    }

    // Flips the layout state variable, automatically updating the HTML classes
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isMobileMenuOpen = false;
  }

  openMobileMenu(): void {
    this.isMobileMenuOpen = true;
    this.isProfilePanelOpen = false;
    this.isNotificationsPanelOpen = false;
  }

  toggleProfile(): void {
    this.isProfilePanelOpen = !this.isProfilePanelOpen;
    this.isNotificationsPanelOpen = false;
    this.isMobileMenuOpen = false;
  }

  toggleNotifications(): void {
    this.isNotificationsPanelOpen = !this.isNotificationsPanelOpen;
    this.isProfilePanelOpen = false;
    this.isMobileMenuOpen = false;
  }

  closeAllPanels(): void {
    this.isMobileMenuOpen = false;
    this.isProfilePanelOpen = false;
    this.isNotificationsPanelOpen = false;
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}