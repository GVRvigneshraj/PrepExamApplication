import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { StudentEndpoints } from '../../../core/api/endpoints/student.endpoint';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class StudentMockService {
  private api = inject(ApiClient);
  private storage = inject(StorageService);

  getMockSeriesList(): Observable<any> {
    const studentId = this.storage.get<number>('userId') || 1;
    return this.api.get(`${StudentEndpoints.GET_MOCK_TESTS}/${studentId}`);
  }

  getSeriesDetail(seriesId: number): Observable<any> {
    return this.api.get(`${StudentEndpoints.GET_MOCK_SERIES_DETAIL}/${seriesId}/detail`);
  }

  startTest(assessmentType: string, referenceId: number): Observable<any> {
    const studentId = this.storage.get<number>('userId') || 1;
    return this.api.post(StudentEndpoints.START_TEST, {
      studentId,
      assessmentType,
      referenceId,
      ipAddress: '',
      browserInfo: navigator.userAgent,
    });
  }

  getMockHistory(): Observable<any> {
    return this.api.get(StudentEndpoints.GET_HISTORY_MOCK);
  }

  submitTest(sessionToken: string): Observable<any> {
    return this.api.post(StudentEndpoints.SUBMIT_TEST, { sessionToken });
  }
}
