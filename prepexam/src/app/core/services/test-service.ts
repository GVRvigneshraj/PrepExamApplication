import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api/api-client';
import { StudentEndpoints } from '../api/endpoints/student.endpoint';

@Injectable({ providedIn: 'root' })
export class TestService {
  private api = inject(ApiClient);

  startTest(body: any): Observable<any> {
    return this.api.post(StudentEndpoints.START_TEST, body);
  }

  saveAnswer(answerPayload: any): Observable<any> {
    return this.api.post(StudentEndpoints.SAVE_ANSWER, answerPayload);
  }

  submitTest(submitPayload: any): Observable<any> {
    return this.api.post(StudentEndpoints.SUBMIT_TEST, submitPayload);
  }

  getAiReview(sessionId: any): Observable<any> {
    return this.api.get(`${StudentEndpoints.GET_AI_REVIEW}/${sessionId}`);
  }
}
