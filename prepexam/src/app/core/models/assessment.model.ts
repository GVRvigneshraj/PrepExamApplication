export interface Assessment {
  id: string;
  sessionId: number;
  sessionCode: string;
  testName: string;
  type: 'diagnostic' | 'chapter' | 'topic' | 'full' | 'revision';
  subject: string;
  chapter?: string;
  topic?: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  hasNegativeMarking: boolean;
  negativeMarksPerWrong: number;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  startedAt?: string;
  completedAt?: string;
  score?: number;
  accuracy?: number;
}

export interface TestConfig {
  testType: string;
  title: string;
  subtitle: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  hasNegativeMarking: boolean;
  showSolution: boolean;
  showTimer: boolean;
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

export interface TestResult {
  sessionId: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  accuracy: number;
  percentage: number;
  totalTimeTakenSeconds: number;
  subjectWiseResults: SubjectWiseResult[];
  aiReport: AiReport;
}

export interface SubjectWiseResult {
  subject: string;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
  marks: number;
}

export interface AiReport {
  title: string;
  overallAnalysis: string;
  performanceSummary: string;
  subjectAnalysis: string;
  strengthAnalysis: string;
  weaknessAnalysis: string;
  comparisonAnalysis: string;
  recommendation: string;
  motivation: string;
  level: string;
  accuracy: number;
  score: number;
  summary: string;
  strongestArea: string;
  weakestArea: string;
}

export interface DiagnosticResult {
  level: string;
  accuracy: number;
  score: number;
  weakAreas: string[];
  strongAreas: string[];
  recommendedChapters: string[];
  studyPlan: StudyPlanItem[];
}

export interface StudyPlanItem {
  day: number;
  subjects: string[];
  topics: string[];
  durationMinutes: number;
  type: 'learn' | 'practice' | 'revision' | 'test';
}
