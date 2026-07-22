// ── History Models ──

export interface HistoryItem {
  id: number;
  testName: string;
  subject: string;
  chapter: string;
  topic: string;
  date: string;
  durationMinutes: number;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  correct: number;
  wrong: number;
  skipped: number;
  difficulty: string;
  attemptNumber: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ABANDONED';
  testType: 'ASSESSMENT' | 'MCQ' | 'MOCK_SERIES' | 'PYQ';
  assessmentId?: number;
  sessionToken?: string;
  grade?: string;
  rank?: number;
  netScore?: number;
  positiveMarks?: number;
  negativeMarks?: number;
}

export interface HistoryResponse {
  success: boolean;
  data: HistoryItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface HistoryDetailResponse {
  success: boolean;
  data: {
    assessment: HistoryItem;
    questions: QuestionReview[];
    aiSummary: AiSummary;
  };
}

export interface QuestionReview {
  questionId: number;
  questionText: string;
  questionHtml: string | null;
  options: ReviewOption[];
  studentAnswerId: number | null;
  correctAnswerId: number;
  isCorrect: boolean;
  explanation: string;
  aiExplanation: string;
  timeTaken: number;
  difficulty: string;
  topic: string;
  chapter: string;
  subject: string;
}

export interface ReviewOption {
  id: number;
  label: string;
  text: string;
  html: string | null;
}

export interface AiSummary {
  overallPerformance: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  predictedScore: number;
  predictedRank: number;
  summary: string;
}

export interface SeriesListItem {
  seriesId: number;
  seriesName: string;
  seriesCode: string;
  description: string;
  totalQuestions: number;
  durationMinutes: number;
  unlocked: boolean;
  attemptCount: number;
  averageAccuracy: number;
  highestAccuracy: number;
}

export interface SeriesDetail {
  seriesId: number;
  seriesName: string;
  description: string;
  totalTests: number;
  completedTests: number;
  averageAccuracy: number;
  tests: SeriesTest[];
}

export interface SeriesTest {
  testId: number;
  testName: string;
  status: 'LOCKED' | 'AVAILABLE' | 'COMPLETED';
  score: number | null;
  accuracy: number | null;
  attemptCount: number;
  durationMinutes: number;
  totalQuestions: number;
}

export interface AnalyticsData {
  weeklyProgress: { day: string; questions: number; accuracy: number }[];
  subjectAccuracy: { subject: string; accuracy: number; color: string }[];
  weakTopics: { topic: string; accuracy: number }[];
  strongTopics: { topic: string; accuracy: number }[];
  recentPerformance: { date: string; score: number; accuracy: number }[];
  timeUsage: { subject: string; minutes: number }[];
}
