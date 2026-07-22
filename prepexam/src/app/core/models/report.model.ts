export interface StudentReport {
  id: string;
  studentId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'overall';
  totalTests: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  accuracy: number;
  averageScore: number;
  totalStudyMinutes: number;
  subjectWisePerformance: SubjectPerformance[];
  dailyTrend: DailyTrend[];
  weakChapters: ChapterPerformance[];
  strongChapters: ChapterPerformance[];
  rank: number;
  totalStudents: number;
  xpEarned: number;
  achievementsUnlocked: string[];
}

export interface SubjectPerformance {
  subject: string;
  totalQuestions: number;
  correct: number;
  accuracy: number;
  averageTimePerQuestion: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface DailyTrend {
  date: string;
  questionsAttempted: number;
  accuracy: number;
  studyMinutes: number;
}

export interface ChapterPerformance {
  chapter: string;
  subject: string;
  totalAttempted: number;
  accuracy: number;
  lastAttempted: string;
}

export interface FacultyReport {
  id: string;
  facultyId: string;
  totalQuestionsCreated: number;
  totalQuestionsApproved: number;
  totalMocksCreated: number;
  averageStudentScore: number;
  studentCount: number;
  topPerformingStudents: StudentPerformanceSummary[];
  bottomPerformingStudents: StudentPerformanceSummary[];
}

export interface StudentPerformanceSummary {
  studentId: string;
  studentName: string;
  accuracy: number;
  testsTaken: number;
  lastActive: string;
}
