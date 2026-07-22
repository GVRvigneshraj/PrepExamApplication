export interface DashboardApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: DashboardData;
}

export interface DashboardData {
  student: DashboardStudent;
  learning: DashboardLearning;
  performance: DashboardPerformance;
  subjectPerformance: DashboardSubjectPerformance[];
  tasks: DashboardTasks;
  strongAreas: DashboardArea;
  weakAreas: DashboardArea;
  aiSummary: DashboardAiSummary;
}

export interface DashboardStudent {
  studentId: number;
  studentName: string;
}

export interface DashboardLearning {
  overallAccuracy: number;
  overallProgress: number;
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  studyStreak: number;
  todayStudyMinutes: number;
}

export interface DashboardPerformance {
  overallAverageScore: number;
  overallAverageTime: number;
  overallPerformancePercentage: number;
  overallPerformanceScore: number;
}

export interface DashboardSubjectPerformance {
  subjectName: string;
  percentage: number;
}

export interface DashboardTasks {
  scheduleDate: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalStudyMinutes: number;
  fullyCompleted: boolean;
  tasks: DashboardTaskItem[];
}

export interface DashboardTaskItem {
  taskId: number;
  taskType: string;
  referenceId: number;
  title: string;
  displayOrder: number;
  priority: number;
  estimatedMinutes: number;
  estimatedQuestions: number;
  taskStatus: string;
  completedAt: string | null;
  accuracy: number | null;
  score: number | null;
  subjectName: string | null;
  chapterName: string | null;
  topicName: string | null;
}

export interface DashboardArea {
  subject: string;
  chapter: string;
}

export interface DashboardAiSummary {
  title: string;
  summary: string;
  recommendation: string;
  estimatedNEETScore: number | null;
  estimatedAIR: number | null;
  focusSubject: string | null;
  focusChapter: string | null;
}

export interface TaskActionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: {
    message: string;
    chapterUnlocked: boolean;
    unlockedChapter: string;
    unlockSubject: string;
    subjectCompleted: boolean;
    mockUnlocked: boolean;
    todayTasks: DashboardTasks;
  };
}
