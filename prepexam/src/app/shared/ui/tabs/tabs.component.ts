import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  count?: number;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-container" [ngClass]="variant">
      <button
        *ngFor="let tab of tabs"
        type="button"
        class="tab-item"
        [class.active]="activeTab === tab.key"
        (click)="selectTab(tab.key)">
        <i *ngIf="tab.icon" [class]="tab.icon"></i>
        <span>{{ tab.label }}</span>
        <span *ngIf="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>
  `,
  styles: [`
    .tabs-container { display: flex; gap: 0.5rem; }
    .tabs-container.pills { background: #f1f5f9; padding: 0.25rem; border-radius: 10px; }
    .tab-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1rem; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; font-size: 0.88rem; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
    .tab-item:hover { border-color: #c7d2fe; }
    .tab-item.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
    .pills .tab-item { border: none; background: transparent; }
    .pills .tab-item.active { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background: rgba(255,255,255,0.2); padding: 0.1rem 0.4rem; border-radius: 10px; font-size: 0.72rem; }
    .tab-item:not(.active) .tab-count { background: #f1f5f9; color: #64748b; }
  `]
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab = '';
  @Input() variant: 'default' | 'pills' = 'default';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(key: string): void {
    this.activeTab = key;
    this.tabChange.emit(key);
  }
}
