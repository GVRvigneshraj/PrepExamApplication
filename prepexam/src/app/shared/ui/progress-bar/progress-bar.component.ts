import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container" [style.height]="height + 'px'">
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="value" [style.background]="color" [class.animated]="animated"></div>
      </div>
      <span *ngIf="showLabel" class="progress-label">{{ value }}%</span>
    </div>
  `,
  styles: [`
    .progress-container { display: flex; align-items: center; gap: 0.75rem; width: 100%; }
    .progress-track { flex: 1; background: #e2e8f0; border-radius: 100px; overflow: hidden; height: 100%; }
    .progress-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; min-width: 2px; }
    .progress-fill.animated { animation: shimmer 2s infinite; background-size: 200% 100%; }
    .progress-label { font-size: 0.82rem; font-weight: 600; color: #475569; min-width: 36px; text-align: right; }
    @keyframes shimmer { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
  `]
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() color = '#4f46e5';
  @Input() height = 8;
  @Input() showLabel = false;
  @Input() animated = false;
}
