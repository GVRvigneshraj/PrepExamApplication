export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  address: string;
  selectedExam: string;
  targetScore: number;
  dailyStudyHours: number;
  preferredLanguage: string;
  hasCompletedOnboarding: boolean;
  hasCompletedDiagnostic: boolean;
  level: number;
  xp: number;
  totalXp: number;
  coins: number;
  studyStreak: number;
  joinDate: string;
}

export interface StudentDashboardData {
  level: number;
  xp: number;
  totalXp: number;
  coins: number;
  studyStreak: number;
  targetScore: number;
  examProgress: number;
  overallAccuracy: number;
  todayPractice: DailyPractice;
  subjectProgress: SubjectProgress[];
  weakChapters: ChapterSummary[];
  strongChapters: ChapterSummary[];
  continueLearning: ContinueItem[];
  upcomingMock: UpcomingTest | null;
  latestReport: ReportSummary | null;
  leaderboardRank: number;
  recentActivity: ActivityItem[];
}

export interface DailyPractice {
  totalQuestions: number;
  completed: number;
  accuracy: number;
  xpEarned: number;
}

export interface SubjectProgress {
  subject: string;
  totalChapters: number;
  completedChapters: number;
  accuracy: number;
  color: string;
}

export interface ChapterSummary {
  id: string;
  name: string;
  subject: string;
  accuracy: number;
  totalQuestions: number;
}

export interface ContinueItem {
  id: string;
  title: string;
  subject: string;
  type: 'lesson' | 'practice' | 'revision';
  progress: number;
  lastAccessed: string;
}

export interface UpcomingTest {
  id: string;
  title: string;
  type: 'mock' | 'assessment' | 'practice';
  scheduledDate: string;
  durationMinutes: number;
  totalQuestions: number;
}

export interface ReportSummary {
  id: string;
  title: string;
  score: number;
  totalMarks: number;
  date: string;
  accuracy: number;
}

export interface ActivityItem {
  id: string;
  type: 'practice' | 'mock' | 'assessment' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface Bookmark {
  id: string;
  questionId: string;
  subject: string;
  chapter: string;
  questionText: string;
  bookmarkedAt: string;
}

export interface WeakArea {
  subject: string;
  chapter: string;
  topic: string;
  accuracy: number;
  totalAttempted: number;
  recommendedAction: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'streak' | 'score' | 'practice' | 'milestone';
}

export interface RevisionItem {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  lastReviewed: string;
  nextReview: string;
  masteryLevel: number;
  totalRevisions: number;
}
