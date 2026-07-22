export interface PlatformAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalTestsTaken: number;
  averageAccuracy: number;
  userGrowth: GrowthData[];
  examDistribution: ExamDistribution[];
  topSubjects: SubjectAnalytics[];
  revenue: RevenueData;
}

export interface GrowthData {
  date: string;
  newUsers: number;
  activeUsers: number;
  testsTaken: number;
}

export interface ExamDistribution {
  exam: string;
  studentCount: number;
  percentage: number;
}

export interface SubjectAnalytics {
  subject: string;
  totalQuestions: number;
  averageAccuracy: number;
  popularChapters: string[];
}

export interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  subscriptionRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatar: string;
  xp: number;
  level: number;
  accuracy: number;
  testsTaken: number;
  streak: number;
}
