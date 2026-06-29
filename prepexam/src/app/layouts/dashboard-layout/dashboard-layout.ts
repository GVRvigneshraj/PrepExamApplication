import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../features/dashboard/shared/header/header';
import { Sidebar } from '../../features/dashboard/shared/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterOutlet, Header, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isProfilePanelOpen = false;
  isNotificationsPanelOpen = false;

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      this.isSidebarCollapsed = false;
      this.isProfilePanelOpen = false;
      this.isNotificationsPanelOpen = false;
      return;
    }

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
}
