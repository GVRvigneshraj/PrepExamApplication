import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payments-container">
      <div class="page-header">
        <h1>Payments</h1>
        <p>Track all payment transactions</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">₹2,45,000</span>
          <span class="stat-label">Total Revenue</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">₹32,500</span>
          <span class="stat-label">This Month</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">156</span>
          <span class="stat-label">Total Transactions</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">3</span>
          <span class="stat-label">Refunds</span>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr><th>User</th><th>Plan</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of payments()">
              <td>{{ p.userName }}</td>
              <td><span class="plan-tag">{{ p.planName }}</span></td>
              <td>₹{{ p.amount }}</td>
              <td>{{ p.paymentMethod }}</td>
              <td><span class="status-badge" [ngClass]="p.status">{{ p.status }}</span></td>
              <td>{{ p.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .payments-container { max-width: 1100px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #0f172a; }
    p { margin: 0.25rem 0 0 0; color: #64748b; }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; text-align: center; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .stat-label { font-size: 0.82rem; color: #94a3b8; }
    .table-container { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 0.85rem 1rem; text-align: left; font-size: 0.78rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    td { padding: 0.85rem 1rem; font-size: 0.9rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
    .plan-tag { background: #eef2ff; color: #4f46e5; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 600; }
    .status-badge { padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
    .status-badge.success { background: #dcfce7; color: #16a34a; }
    .status-badge.pending { background: #fef3c7; color: #d97706; }
    .status-badge.failed { background: #fee2e2; color: #dc2626; }
    .status-badge.refunded { background: #e0f2fe; color: #0284c7; }
  `]
})
export class AdminPaymentsComponent {
  payments = signal([
    { id: '1', userName: 'Rahul Sharma', planName: 'Pro Monthly', amount: 999, paymentMethod: 'UPI', status: 'success', createdAt: '2025-07-18' },
    { id: '2', userName: 'Priya Patel', planName: 'Premium Yearly', amount: 4999, paymentMethod: 'Credit Card', status: 'success', createdAt: '2025-07-17' },
    { id: '3', userName: 'Amit Kumar', planName: 'Pro Monthly', amount: 999, paymentMethod: 'Net Banking', status: 'pending', createdAt: '2025-07-16' },
    { id: '4', userName: 'Sneha Reddy', planName: 'Basic Monthly', amount: 499, paymentMethod: 'UPI', status: 'success', createdAt: '2025-07-15' },
    { id: '5', userName: 'Vikram Singh', planName: 'Pro Monthly', amount: 999, paymentMethod: 'Debit Card', status: 'refunded', createdAt: '2025-07-14' },
  ]);
}
