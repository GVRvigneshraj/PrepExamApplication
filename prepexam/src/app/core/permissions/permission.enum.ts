export enum Permission {
  // Student
  STUDENT_VIEW_DASHBOARD = 'student:view_dashboard',
  STUDENT_TAKE_ASSESSMENT = 'student:take_assessment',
  STUDENT_VIEW_REPORTS = 'student:view_reports',
  STUDENT_USE_AI_TUTOR = 'student:use_ai_tutor',
  STUDENT_MANAGE_BOOKMARKS = 'student:manage_bookmarks',

  // Faculty
  FACULTY_VIEW_DASHBOARD = 'faculty:view_dashboard',
  FACULTY_MANAGE_QUESTIONS = 'faculty:manage_questions',
  FACULTY_APPROVE_QUESTIONS = 'faculty:approve_questions',
  FACULTY_BUILD_MOCK = 'faculty:build_mock',
  FACULTY_VIEW_STUDENT_ANALYTICS = 'faculty:view_student_analytics',

  // Admin
  ADMIN_VIEW_DASHBOARD = 'admin:view_dashboard',
  ADMIN_MANAGE_USERS = 'admin:manage_users',
  ADMIN_MANAGE_FACULTY = 'admin:manage_faculty',
  ADMIN_MANAGE_STUDENTS = 'admin:manage_students',
  ADMIN_MANAGE_EXAMS = 'admin:manage_exams',
  ADMIN_MANAGE_PERMISSIONS = 'admin:manage_permissions',
  ADMIN_MANAGE_SUBSCRIPTIONS = 'admin:manage_subscriptions',
  ADMIN_VIEW_ANALYTICS = 'admin:view_analytics',
  ADMIN_VIEW_AUDIT_LOGS = 'admin:view_audit_logs',
  ADMIN_MANAGE_SETTINGS = 'admin:manage_settings',
}
