import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span [class]="'badge badge-' + variant()">{{ text() }}</span>`,
  styles: [`
    .badge { display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-primary { background: #EEF2FF; color: #4F46E5; }
    .badge-success { background: #F0FDF4; color: #16A34A; }
    .badge-warning { background: #FFFBEB; color: #D97706; }
    .badge-danger { background: #FEF2F2; color: #DC2626; }
    .badge-info { background: #EFF6FF; color: #2563EB; }
  `],
})
export class BadgeComponent {
  text = input('');
  variant = input<'primary' | 'success' | 'warning' | 'danger' | 'info'>('primary');
}
