import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { StudentEndpoints } from '../../../core/api/endpoints/student.endpoint';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private api = inject(ApiClient);

  getReports(): Observable<any> {
    return this.api.get(StudentEndpoints.GET_REPORTS);
  }
}
