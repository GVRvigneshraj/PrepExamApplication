export interface StudentDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  enrolledExams: string[];
  createdAt: string;
  lastActiveAt: string;
}

export interface FacultyDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  subjects: string[];
  createdAt: string;
}

export interface AdminDto {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}
