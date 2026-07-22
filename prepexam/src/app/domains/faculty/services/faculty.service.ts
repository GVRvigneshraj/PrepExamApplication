import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { FacultyEndpoints } from '../../../core/api/endpoints/faculty.endpoint';

@Injectable({ providedIn: 'root' })
export class FacultyService {
  private api = inject(ApiClient);

  getDashboard(): Observable<any> {
    return this.api.get(FacultyEndpoints.GET_DASHBOARD);
  }

  getQuestionBank(): Observable<any> {
    return this.api.get(FacultyEndpoints.GET_QUESTION_BANK);
  }

  getStudentAnalytics(): Observable<any> {
    return this.api.get(FacultyEndpoints.GET_STUDENT_ANALYTICS);
  }

  getReports(): Observable<any> {
    return this.api.get(FacultyEndpoints.GET_REPORTS);
  }
}
