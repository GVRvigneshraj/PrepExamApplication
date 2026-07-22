export interface TaskItem {
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

export interface TodayTasksData {
  scheduleDate: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalStudyMinutes: number;
  fullyCompleted: boolean;
  tasks: TaskItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: T;
}
