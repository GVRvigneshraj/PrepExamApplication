import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api/api-client';
import { StudentEndpoints } from '../api/endpoints/student.endpoint';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private api = inject(ApiClient);
  private storage = inject(StorageService);

  private get studentId(): number {
    return this.storage.get<number>('userId') || 1;
  }

  getAssessmentHistory(page: number = 0, size: number = 20): Observable<any> {
    return this.api.get(StudentEndpoints.GET_HISTORY_ASSESSMENT, {
      studentId: String(this.studentId),
      page: String(page),
      size: String(size),
    });
  }

  getMcqHistory(page: number = 0, size: number = 20): Observable<any> {
    return this.api.get(StudentEndpoints.GET_HISTORY_MCQ, {
      studentId: String(this.studentId),
      page: String(page),
      size: String(size),
    });
  }

  getMockHistory(page: number = 0, size: number = 20): Observable<any> {
    return this.api.get(StudentEndpoints.GET_HISTORY_MOCK, {
      studentId: String(this.studentId),
      page: String(page),
      size: String(size),
    });
  }

  getPyqHistory(page: number = 0, size: number = 20): Observable<any> {
    return this.api.get(StudentEndpoints.GET_HISTORY_PYQ, {
      studentId: String(this.studentId),
      page: String(page),
      size: String(size),
    });
  }

  getHistoryDetail(assessmentId: number): Observable<any> {
    return this.api.get(`${StudentEndpoints.GET_HISTORY_DETAIL}/${assessmentId}`);
  }
}
