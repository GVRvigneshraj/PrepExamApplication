import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'icon' | 'action' | 'custom';
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let col of columns" [style.width]="col.width || 'auto'">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index" (click)="onRowClick.emit(row)">
            <td *ngFor="let col of columns">
              <ng-container [ngSwitch]="col.type">
                <span *ngSwitchCase="'badge'" class="badge" [ngClass]="row[col.key + 'Class'] || ''">
                  {{ row[col.key] }}
                </span>
                <i *ngSwitchCase="'icon'" [class]="row[col.key]"></i>
                <ng-container *ngSwitchCase="'custom'">
                  <ng-content></ng-content>
                </ng-container>
                <span *ngSwitchDefault>{{ row[col.key] }}</span>
              </ng-container>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length" class="empty-row">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-wrapper { overflow-x: auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; }
    .data-table { width: 100%; border-collapse: collapse; }
    th { padding: 0.85rem 1rem; text-align: left; font-size: 0.78rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
    td { padding: 0.85rem 1rem; font-size: 0.9rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
    tr:last-child td { border-bottom: none; }
    tr:not(:first-child):hover { background: #f8fafc; }
    .empty-row { text-align: center; padding: 2rem !important; color: #94a3b8; }
    .badge { padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
  `]
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() emptyMessage = 'No data available';
  @Output() onRowClick = new EventEmitter<any>();
}
