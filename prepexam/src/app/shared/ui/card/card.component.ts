import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="'card card-' + variant()">
      @if (title()) {
        <div class="card-header">
          <h3 class="card-title">{{ title() }}</h3>
          <ng-content select="[header-actions]" />
        </div>
      }
      <div class="card-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .card { background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #E2E8F0; }
    .card-title { font-size: 1.125rem; font-weight: 600; color: #1E293B; margin: 0; }
    .card-body { padding: 1.5rem; }
    .card-elevated { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .card-outlined { border: 1px solid #E2E8F0; box-shadow: none; }
  `],
})
export class CardComponent {
  title = input<string>('');
  variant = input<'default' | 'elevated' | 'outlined'>('default');
}
