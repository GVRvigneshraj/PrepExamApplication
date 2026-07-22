export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'ROLE_ADMIN' | 'ROLE_FACULTY' | 'ROLE_STUDENT';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  avatar: string;
}

export interface FacultyAdmin {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  department: string;
  specialization: string[];
  status: 'active' | 'inactive';
  questionsCreated: number;
  mocksCreated: number;
  joinDate: string;
}

export interface StudentAdmin {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  selectedExam: string;
  level: number;
  overallAccuracy: number;
  totalTests: number;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
}

export interface ExamManagement {
  id: string;
  name: string;
  code: string;
  subjects: SubjectManagement[];
  totalQuestions: number;
  status: 'active' | 'inactive';
}

export interface SubjectManagement {
  id: string;
  name: string;
  chapters: ChapterManagement[];
  totalQuestions: number;
}

export interface ChapterManagement {
  id: string;
  name: string;
  topics: string[];
  totalQuestions: number;
}

export interface RoleManagement {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  subscriberCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
  applicablePlans: string[];
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  planName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  category: string;
  description: string;
  lastModified: string;
  modifiedBy: string;
}
