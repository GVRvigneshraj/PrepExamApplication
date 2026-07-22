import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card" [class.clickable]="clickable">
      <div class="stats-icon" [style.background]="iconBg" [style.color]="iconColor">
        <i [class]="icon"></i>
      </div>
      <div class="stats-info">
        <span class="stats-value">{{ value }}</span>
        <span class="stats-label">{{ label }}</span>
      </div>
      <span *ngIf="trend" class="stats-trend" [ngClass]="trend > 0 ? 'up' : 'down'">
        <i [class]="trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>
  `,
  styles: [`
    .stats-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; transition: all 0.15s; }
    .stats-card.clickable { cursor: pointer; }
    .stats-card:hover { border-color: #c7d2fe; transform: translateY(-1px); }
    .stats-icon { width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; font-size: 1.2rem; flex-shrink: 0; }
    .stats-info { flex: 1; }
    .stats-value { display: block; font-size: 1.35rem; font-weight: 800; color: #0f172a; }
    .stats-label { font-size: 0.82rem; color: #94a3b8; }
    .stats-trend { font-size: 0.78rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; }
    .stats-trend.up { color: #16a34a; }
    .stats-trend.down { color: #dc2626; }
  `]
})
export class StatsCardComponent {
  @Input() value: string | number = '';
  @Input() label = '';
  @Input() icon = '';
  @Input() iconBg = '#eef2ff';
  @Input() iconColor = '#4f46e5';
  @Input() trend?: number;
  @Input() clickable = false;
}
