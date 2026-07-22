import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../../../core/api/api-client';
import { CommonEndpoints } from '../../../core/api/endpoints/common.endpoint';
import { EXAM_CONFIGS, ExamConfig } from '../../../core/config/exam.config';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private api = inject(ApiClient);

  getAllExams() {
    return this.api.get(CommonEndpoints.GET_EXAMS);
  }

  getExamConfig(examId: string): ExamConfig | undefined {
    return EXAM_CONFIGS[examId];
  }

  getSubjects(examId: string) {
    return this.api.get(CommonEndpoints.GET_SUBJECTS, { examId });
  }

  getChapters(subjectId: string) {
    return this.api.get(CommonEndpoints.GET_CHAPTERS, { subjectId });
  }
}
