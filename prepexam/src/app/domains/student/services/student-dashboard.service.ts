import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiClient } from '../../../core/api/api-client';
import { StudentEndpoints } from '../../../core/api/endpoints/student.endpoint';
import { DashboardApiResponse, TaskActionResponse } from '../../../core/api/dto/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class StudentDashboardService {
  private api = inject(ApiClient);

  getDashboard(): Observable<DashboardApiResponse | null> {
    return this.api.get<DashboardApiResponse>(StudentEndpoints.GET_DASHBOARD).pipe(
      catchError(() => of(null))
    );
  }

  startTask(taskId: number): Observable<any> {
    return this.api.post(`${StudentEndpoints.START_TASK}/${taskId}/start`, {}).pipe(
      catchError(() => of(null))
    );
  }

  completeTask(taskId: number, data: { accuracy: number; score: number; studyMinutes: number; metadata?: string }): Observable<TaskActionResponse | null> {
    return this.api.post<TaskActionResponse>(`${StudentEndpoints.COMPLETE_TASK}/${taskId}/complete`, data).pipe(
      catchError(() => of(null))
    );
  }

  skipTask(taskId: number): Observable<TaskActionResponse | null> {
    return this.api.post<TaskActionResponse>(`${StudentEndpoints.SKIP_TASK}/${taskId}/skip`, {}).pipe(
      catchError(() => of(null))
    );
  }
}
