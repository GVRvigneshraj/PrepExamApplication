import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api/api-client';
import { StudentEndpoints } from '../api/endpoints/student.endpoint';

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private api = inject(ApiClient);

  getAssessment(): Observable<any> {
    return this.api.get(StudentEndpoints.GET_ASSESSMENT);
  }

  getAssessmentById(id: number): Observable<any> {
    return this.api.get(`${StudentEndpoints.GET_ASSESSMENT_BY_ID}/${id}`);
  }

  submitAssessment(payload: any): Observable<any> {
    return this.api.post(StudentEndpoints.SUBMIT_ASSESSMENT, payload);
  }
}
