import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { AdminEndpoints } from '../../../core/api/endpoints/admin.endpoint';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiClient);

  getDashboard(): Observable<any> {
    return this.api.get(AdminEndpoints.GET_DASHBOARD);
  }

  getUsers(): Observable<any> {
    return this.api.get(AdminEndpoints.GET_USERS);
  }

  getExams(): Observable<any> {
    return this.api.get(AdminEndpoints.GET_EXAMS);
  }

  getSettings(): Observable<any> {
    return this.api.get(AdminEndpoints.GET_SETTINGS);
  }

  getAuditLogs(): Observable<any> {
    return this.api.get(AdminEndpoints.GET_AUDIT_LOGS);
  }
}
