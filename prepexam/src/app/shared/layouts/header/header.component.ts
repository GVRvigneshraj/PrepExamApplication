import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isSidebarCollapsed = false;
  @Input() isProfileOpen = false;
  @Input() isNotificationsOpen = false;

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleProfile = new EventEmitter<void>();
  @Output() toggleNotifications = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleProfile(): void {
    this.toggleProfile.emit();
  }

  onToggleNotifications(): void {
    this.toggleNotifications.emit();
  }
}
