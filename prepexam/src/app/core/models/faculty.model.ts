export interface FacultyProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  specialization: string[];
  joinDate: string;
  totalQuestionsCreated: number;
  totalMocksCreated: number;
}

export interface QuestionBankItem {
  id: string;
  questionText: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  marks: number;
  negativeMarks: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  optionId: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionApprovalItem {
  id: string;
  question: QuestionBankItem;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface MockTestConfig {
  id: string;
  title: string;
  description: string;
  subjects: string[];
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  createdAt: string;
  attempts: number;
  averageScore: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  totalQuestions: number;
  assignedTo: string[];
  submittedCount: number;
  averageScore: number;
  status: 'active' | 'closed' | 'draft';
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  email: string;
  overallAccuracy: number;
  totalTests: number;
  lastActive: string;
  weakSubjects: string[];
  strongSubjects: string[];
  studyHours: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'lesson' | 'video' | 'document' | 'quiz';
  subject: string;
  chapter: string;
  status: 'draft' | 'published';
  createdAt: string;
  viewCount: number;
}
