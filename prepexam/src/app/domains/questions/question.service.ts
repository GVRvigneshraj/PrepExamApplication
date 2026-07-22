import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/api/api-client';
import { CommonEndpoints } from '../../core/api/endpoints/common.endpoint';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private api = inject(ApiClient);

  getQuestions(topicId?: string): Observable<any> {
    const params = topicId ? { topicId } : undefined;
    return this.api.get(CommonEndpoints.GET_TOPICS, params);
  }
}
