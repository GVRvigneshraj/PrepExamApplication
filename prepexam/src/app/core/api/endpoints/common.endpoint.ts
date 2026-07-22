import { environment } from '../../../../environments/environment';

const BASE = environment.apiBaseUrl;

export const CommonEndpoints = {
  GET_EXAMS: `${BASE}/exams`,
  GET_SUBJECTS: `${BASE}/subjects`,
  GET_CHAPTERS: `${BASE}/chapters`,
  GET_TOPICS: `${BASE}/topics`,
  SEARCH: `${BASE}/search`,
  UPLOAD_FILE: `${BASE}/upload`,
  AI_CHAT: `${BASE}/ai/chat`,
  AI_TUTOR: `${BASE}/ai/tutor`,
} as const;
