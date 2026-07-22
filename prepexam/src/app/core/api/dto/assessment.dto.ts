export interface AssessmentDto {
  id: string;
  title: string;
  examId: string;
  subjectId?: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
}

export interface AssessmentResultDto {
  assessmentId: string;
  studentId: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeTakenMinutes: number;
  completedAt: string;
}

export interface QuestionAttemptDto {
  questionId: string;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeTakenSeconds: number;
}
