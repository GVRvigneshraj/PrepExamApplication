import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/api/api-client';
import { AdminEndpoints } from '../../core/api/endpoints/admin.endpoint';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private api = inject(ApiClient);

  getPlatformAnalytics(): Observable<any> {
    return this.api.get(AdminEndpoints.GET_ANALYTICS);
  }

  getUserGrowth(): Observable<any> {
    return this.api.get(AdminEndpoints.GET_ANALYTICS);
  }
}
