import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="breadcrumb">
      @for (item of items(); track item.label; let last = $last) {
        @if (item.link && !last) {
          <a [routerLink]="item.link" class="breadcrumb-link">{{ item.label }}</a>
          <span class="separator">/</span>
        } @else {
          <span [class]="'breadcrumb-current' + (last ? ' last' : '')">{{ item.label }}</span>
          @if (!last) {
            <span class="separator">/</span>
          }
        }
      }
    </nav>
  `,
  styles: [`
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #64748B; margin-bottom: 1rem; }
    .breadcrumb-link { color: #6366F1; text-decoration: none; }
    .breadcrumb-link:hover { text-decoration: underline; }
    .separator { color: #CBD5E1; }
    .breadcrumb-current { color: #1E293B; }
    .breadcrumb-current.last { font-weight: 500; }
  `],
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}
