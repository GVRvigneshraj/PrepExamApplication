import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/layouts/header/header.component';
import { SidebarComponent } from '../../shared/layouts/sidebar/sidebar.component';
import { ADMIN_ROUTES } from '../../core/config/route.config';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <app-sidebar [collapsed]="false" [mobileOpen]="false" />
      </aside>
      <div class="main-wrapper">
        <header class="header">
          <app-header (toggleSidebar)="{}" (toggleProfile)="{}" (toggleNotifications)="{}" />
        </header>
        <main class="page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; height: 100vh; overflow: hidden; }
    .sidebar { width: 260px; background: #fff; border-right: 1px solid #e5e7eb; }
    .main-wrapper { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .header { height: 72px; background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; padding: 0 24px; }
    .page-content { flex: 1; overflow-y: auto; background: #f8fafc; padding: 1.5rem; }
  `],
})
export class AdminLayout {
  adminRoutes = ADMIN_ROUTES;
}
