import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../core/api/api-client';
import { CommonEndpoints } from '../../core/api/endpoints/common.endpoint';

@Injectable({ providedIn: 'root' })
export class AiTutorService {
  private api = inject(ApiClient);

  sendMessage(message: string, context?: string): Observable<any> {
    return this.api.post(CommonEndpoints.AI_CHAT, { message, context });
  }

  getTutorResponse(question: string, subject?: string): Observable<any> {
    return this.api.post(CommonEndpoints.AI_TUTOR, { question, subject });
  }
}
