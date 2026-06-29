import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() collapsed = false;
  @Input() mobileOpen = false;

  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() closeMobileMenu = new EventEmitter<void>();

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  onCloseMobileMenu(): void {
    this.closeMobileMenu.emit();
  }
}
