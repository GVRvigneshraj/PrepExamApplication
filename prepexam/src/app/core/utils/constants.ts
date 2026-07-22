export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  ROLE: 'role',
  THEME: 'theme',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  SELECTED_EXAM: 'selectedExam',
  USER_PROFILE: 'userProfile',
  LEARNING_SETTINGS: 'learningSettings',
  NOTIFICATION_PREFS: 'notificationPrefs',
  BOOKMARKS: 'bookmarks',
  REVISION_ITEMS: 'revisionItems',
  TEST_HISTORY: 'testHistory',
} as const;

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  FACULTY: 'ROLE_FACULTY',
  STUDENT: 'ROLE_STUDENT',
} as const;

export const APP_NAME = 'PrepExam AI';

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;
