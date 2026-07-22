import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface DropdownItem {
  key: string;
  label: string;
  icon?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown-wrapper" (click)="$event.stopPropagation()">
      <button type="button" class="dropdown-trigger" [class.active]="isOpen" (click)="toggle()">
        <ng-content></ng-content>
        <i class="fas fa-chevron-down"></i>
      </button>
      <div class="dropdown-menu" *ngIf="isOpen">
        <button
          *ngFor="let item of items"
          type="button"
          class="dropdown-item"
          [class.danger]="item.danger"
          (click)="select(item)">
          <i *ngIf="item.icon" [class]="item.icon"></i>
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dropdown-wrapper { position: relative; display: inline-block; }
    .dropdown-trigger { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.85rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 0.85rem; color: #475569; cursor: pointer; transition: all 0.15s; }
    .dropdown-trigger:hover, .dropdown-trigger.active { border-color: #c7d2fe; }
    .dropdown-menu { position: absolute; top: 100%; right: 0; margin-top: 0.35rem; min-width: 180px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(15,23,42,0.12); z-index: 50; overflow: hidden; }
    .dropdown-item { display: flex; align-items: center; gap: 0.65rem; width: 100%; padding: 0.65rem 1rem; border: none; background: transparent; font-size: 0.88rem; color: #475569; cursor: pointer; text-align: left; transition: background 0.1s; }
    .dropdown-item:hover { background: #f8fafc; }
    .dropdown-item.danger { color: #dc2626; }
    .dropdown-item.danger:hover { background: #fee2e2; }
  `]
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Output() itemSelect = new EventEmitter<DropdownItem>();

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  select(item: DropdownItem): void {
    this.itemSelect.emit(item);
    this.isOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpen = false;
  }
}
