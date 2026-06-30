export interface AssessmentQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}

export interface UniversalTestPayload {
  testType: 'chapter' | 'mock' | 'pyq';
  sourceId: string;
  title: string;
  categoryLabel: string;
  durationMinutes: number;
  questions: AssessmentQuestion[];
}
