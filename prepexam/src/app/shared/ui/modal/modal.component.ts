import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ title() }}</h3>
            <button class="modal-close" (click)="close.emit()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-container { background: white; border-radius: 0.75rem; width: 90%; max-width: 32rem; max-height: 80vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #E2E8F0; }
    .modal-header h3 { margin: 0; font-size: 1.125rem; }
    .modal-close { background: none; border: none; cursor: pointer; font-size: 1.25rem; color: #64748B; }
    .modal-body { padding: 1.5rem; }
  `],
})
export class ModalComponent {
  isOpen = input(false);
  title = input('');
  close = output();
}
