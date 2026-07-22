import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="audit-container">
      <div class="page-header">
        <h1>Audit Logs</h1>
        <p>Track all system activities and changes</p>
      </div>

      <div class="filters">
        <select class="filter-select">
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="login">Login</option>
        </select>
        <input type="date" class="filter-date" />
      </div>

      <div class="logs-list">
        <div class="log-item" *ngFor="let log of logs()">
          <div class="log-icon" [ngClass]="log.actionType">
            <i [class]="log.icon"></i>
          </div>
          <div class="log-info">
            <h4>{{ log.action }}</h4>
            <p>{{ log.details }}</p>
          </div>
          <div class="log-meta">
            <span class="user">{{ log.user }}</span>
            <span class="time">{{ log.timestamp }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .audit-container { max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #0f172a; }
    p { margin: 0.25rem 0 0 0; color: #64748b; }
    .filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    .filter-select, .filter-date { padding: 0.6rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.88rem; color: #1e293b; background: #fff; }
    .logs-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .log-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; }
    .log-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; font-size: 1rem; flex-shrink: 0;
      &.create { background: #dcfce7; color: #16a34a; }
      &.update { background: #eef2ff; color: #4f46e5; }
      &.delete { background: #fee2e2; color: #dc2626; }
      &.login { background: #e0f2fe; color: #0284c7; }
    }
    .log-info { flex: 1; }
    .log-info h4 { margin: 0; font-size: 0.9rem; color: #1e293b; }
    .log-info p { margin: 2px 0 0 0; font-size: 0.78rem; color: #94a3b8; }
    .log-meta { text-align: right; }
    .log-meta .user { display: block; font-size: 0.82rem; font-weight: 600; color: #475569; }
    .log-meta .time { font-size: 0.72rem; color: #94a3b8; }
  `]
})
export class AdminAuditLogsComponent {
  logs = signal([
    { id: '1', action: 'Question Created', details: 'New question added to Physics - Mechanics', user: 'Dr. Rajesh', timestamp: '2025-07-18 14:30', icon: 'fas fa-plus', actionType: 'create' },
    { id: '2', action: 'Mock Test Published', details: 'Full Syllabus Mock Set Alpha published', user: 'Prof. Sunita', timestamp: '2025-07-18 12:15', icon: 'fas fa-edit', actionType: 'update' },
    { id: '3', action: 'Student Login', details: 'Student account logged in from new device', user: 'Student #1247', timestamp: '2025-07-18 11:00', icon: 'fas fa-sign-in-alt', actionType: 'login' },
    { id: '4', action: 'Faculty Deactivated', details: 'Faculty account for Prof. Priya Singh deactivated', user: 'Admin', timestamp: '2025-07-17 16:45', icon: 'fas fa-ban', actionType: 'delete' },
    { id: '5', action: 'Question Approved', details: '15 questions approved from pending queue', user: 'Dr. Amit', timestamp: '2025-07-17 10:30', icon: 'fas fa-check', actionType: 'update' },
  ]);
}
