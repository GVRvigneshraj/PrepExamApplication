import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <i [class]="'empty-icon fas ' + icon()"></i>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (actionLabel()) {
        <button class="empty-action" (click)="action.emit()">{{ actionLabel() }}</button>
      }
    </div>
  `,
  styles: [`
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center; }
    .empty-icon { font-size: 3rem; color: #CBD5E1; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem; color: #1E293B; }
    .empty-state p { color: #64748B; margin: 0 0 1rem; }
    .empty-action { background: #6366F1; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500; }
  `],
})
export class EmptyStateComponent {
  icon = input('fa-inbox');
  title = input('No data found');
  message = input('');
  actionLabel = input('');
  action = output();
}
