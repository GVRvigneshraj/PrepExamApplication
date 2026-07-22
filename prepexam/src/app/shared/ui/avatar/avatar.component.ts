import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [style.width]="size + 'px'" [style.height]="size + 'px'" [style.font-size]="fontSize + 'px'" [ngClass]="shape">
      <img *ngIf="src" [src]="src" [alt]="name" />
      <span *ngIf="!src">{{ initials }}</span>
      <span *ngIf="showStatus" class="status-dot" [ngClass]="status"></span>
    </div>
  `,
  styles: [`
    .avatar { position: relative; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; font-weight: 700; overflow: hidden; flex-shrink: 0; }
    .avatar.rounded { border-radius: 12px; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .status-dot { position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; }
    .status-dot.online { background: #22c55e; }
    .status-dot.offline { background: #94a3b8; }
    .status-dot.busy { background: #ef4444; }
  `]
})
export class AvatarComponent {
  @Input() src = '';
  @Input() name = '';
  @Input() size = 40;
  @Input() shape: 'circle' | 'rounded' = 'circle';
  @Input() showStatus = false;
  @Input() status: 'online' | 'offline' | 'busy' = 'online';

  get initials(): string {
    if (!this.name) return '?';
    return this.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  get fontSize(): number {
    return Math.round(this.size * 0.38);
  }
}
