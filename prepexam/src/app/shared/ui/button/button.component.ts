import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="'btn btn-' + variant() + ' btn-' + size() + (loading() ? ' btn-loading' : '')"
    >
      @if (loading()) {
        <i class="fas fa-spinner fa-spin"></i>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: #6366F1; color: white; }
    .btn-primary:hover:not(:disabled) { background: #4F46E5; }
    .btn-secondary { background: #E2E8F0; color: #1E293B; }
    .btn-danger { background: #EF4444; color: white; }
    .btn-danger:hover:not(:disabled) { background: #DC2626; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
    .btn-md { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .btn-lg { padding: 0.75rem 1.5rem; font-size: 1rem; }
  `],
})
export class ButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  loading = input(false);
}
