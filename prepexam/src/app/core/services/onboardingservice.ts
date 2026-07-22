import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api/api-client';
import { StudentEndpoints } from '../api/endpoints/student.endpoint';

@Injectable({ providedIn: 'root' })
export class Onboardingservice {
  private api = inject(ApiClient);

  GetAllExamList(): Observable<any> {
    return this.api.get(StudentEndpoints.GET_ALL_EXAMS);
  }

  UpdateInitialSetup(body: any): Observable<any> {
    return this.api.post(StudentEndpoints.UPDATE_INITIAL_SETUP, body);
  }

  GetInitialTestQuestions(body: any): Observable<any> {
    return this.api.post(StudentEndpoints.START_TEST, body);
  }

  submitInitialTestAnswers(data: any): Observable<any> {
    return this.api.post(StudentEndpoints.SUBMIT_TEST, data);
  }
}
