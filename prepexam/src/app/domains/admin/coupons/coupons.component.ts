import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="coupons-container">
      <div class="page-header">
        <div>
          <h1>Coupons</h1>
          <p>Manage discount coupons and promotional offers</p>
        </div>
        <button class="btn-primary"><i class="fas fa-plus"></i> Create Coupon</button>
      </div>

      <div class="coupons-grid">
        <div class="coupon-card" *ngFor="let coupon of coupons()">
          <div class="coupon-header">
            <span class="coupon-code">{{ coupon.code }}</span>
            <span class="coupon-type" [class.percentage]="coupon.type === 'percentage'">
              {{ coupon.discount }}{{ coupon.type === 'percentage' ? '%' : '₹' }} OFF
            </span>
          </div>
          <div class="coupon-info">
            <p>Valid until: {{ coupon.expiryDate }}</p>
            <p>Uses: {{ coupon.currentUses }} / {{ coupon.maxUses }}</p>
            <div class="usage-bar">
              <div class="usage-fill" [style.width.%]="(coupon.currentUses / coupon.maxUses) * 100"></div>
            </div>
          </div>
          <div class="coupon-footer">
            <span class="status-badge" [class.active]="coupon.isActive" [class.inactive]="!coupon.isActive">
              {{ coupon.isActive ? 'Active' : 'Expired' }}
            </span>
            <button class="icon-btn"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .coupons-container { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #0f172a; }
    p { margin: 0.25rem 0 0 0; color: #64748b; }
    .btn-primary { padding: 0.65rem 1.25rem; background: #4f46e5; color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
    .coupons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .coupon-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.25rem; }
    .coupon-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .coupon-code { font-family: monospace; font-size: 1rem; font-weight: 700; color: #1e293b; background: #f1f5f9; padding: 0.35rem 0.75rem; border-radius: 6px; letter-spacing: 1px; }
    .coupon-type { font-weight: 700; font-size: 0.9rem; color: #16a34a; }
    .coupon-type.percentage { color: #4f46e5; }
    .coupon-info p { margin: 0.25rem 0; font-size: 0.82rem; color: #64748b; }
    .usage-bar { height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin-top: 0.5rem; }
    .usage-fill { height: 100%; background: #4f46e5; border-radius: 2px; }
    .coupon-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; }
    .status-badge { padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
    .status-badge.active { background: #dcfce7; color: #16a34a; }
    .status-badge.inactive { background: #fee2e2; color: #dc2626; }
    .icon-btn { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; display: grid; place-items: center; color: #64748b; background: #f1f5f9; }
    .icon-btn:hover { background: #fee2e2; color: #dc2626; }
  `]
})
export class AdminCouponsComponent {
  coupons = signal([
    { id: '1', code: 'WELCOME20', discount: 20, type: 'percentage', maxUses: 1000, currentUses: 342, expiryDate: '2025-12-31', isActive: true },
    { id: '2', code: 'FESTIVE50', discount: 50, type: 'percentage', maxUses: 500, currentUses: 500, expiryDate: '2025-08-15', isActive: false },
    { id: '3', code: 'FLAT100', discount: 100, type: 'fixed', maxUses: 200, currentUses: 45, expiryDate: '2025-09-30', isActive: true },
  ]);
}
