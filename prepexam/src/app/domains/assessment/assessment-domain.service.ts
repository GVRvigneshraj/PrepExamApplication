import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/api/api-client';
import { StudentEndpoints } from '../../core/api/endpoints/student.endpoint';

@Injectable({ providedIn: 'root' })
export class AssessmentDomainService {
  private api = inject(ApiClient);

  getAssessments(): Observable<any> {
    return this.api.get(StudentEndpoints.GET_ASSESSMENT);
  }

  submitAssessment(assessmentId: string, answers: unknown): Observable<any> {
    return this.api.post(StudentEndpoints.SUBMIT_ASSESSMENT, { assessmentId, answers });
  }
}
