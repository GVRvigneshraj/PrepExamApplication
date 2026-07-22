import { environment } from '../../../../environments/environment';

const BASE = environment.apiBaseUrl;

export const FacultyEndpoints = {
  GET_DASHBOARD: `${BASE}/faculty/dashboard`,
  GET_QUESTION_BANK: `${BASE}/faculty/questions`,
  CREATE_QUESTION: `${BASE}/faculty/questions`,
  UPDATE_QUESTION: `${BASE}/faculty/questions`,
  DELETE_QUESTION: `${BASE}/faculty/questions`,
  IMPORT_QUESTIONS: `${BASE}/faculty/questions/import`,
  APPROVE_QUESTION: `${BASE}/faculty/questions/approve`,
  GET_MOCK_BUILDER: `${BASE}/faculty/mock`,
  CREATE_MOCK: `${BASE}/faculty/mock`,
  UPDATE_MOCK: `${BASE}/faculty/mock`,
  DELETE_MOCK: `${BASE}/faculty/mock`,
  GET_STUDENT_ANALYTICS: `${BASE}/faculty/analytics/students`,
  GET_REPORTS: `${BASE}/faculty/reports`,
  GET_PROFILE: `${BASE}/faculty/profile`,
  UPDATE_PROFILE: `${BASE}/faculty/profile`,
} as const;
