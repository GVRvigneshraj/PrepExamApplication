export interface FeatureFlag {
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  allowedRoles?: string[];
}

export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  AI_TUTOR: {
    enabled: true,
    description: 'AI-powered doubt solving and tutoring',
    allowedRoles: ['ROLE_STUDENT'],
  },
  AI_CHAT: {
    enabled: true,
    description: 'Real-time AI chat interface',
    allowedRoles: ['ROLE_STUDENT'],
  },
  MOCK_TEST: {
    enabled: true,
    description: 'Full-length mock test functionality',
    allowedRoles: ['ROLE_STUDENT'],
  },
  PYQ_PAPERS: {
    enabled: true,
    description: 'Previous year question papers',
    allowedRoles: ['ROLE_STUDENT'],
  },
  LEADERBOARD: {
    enabled: true,
    description: 'Student ranking and leaderboard',
    allowedRoles: ['ROLE_STUDENT'],
  },
  ACHIEVEMENTS: {
    enabled: true,
    description: 'Gamification and achievement badges',
    allowedRoles: ['ROLE_STUDENT'],
  },
  REVISION_SPACED: {
    enabled: true,
    description: 'Spaced repetition revision system',
    allowedRoles: ['ROLE_STUDENT'],
  },
  QUESTION_APPROVAL: {
    enabled: true,
    description: 'Faculty question approval workflow',
    allowedRoles: ['ROLE_FACULTY'],
  },
  MOCK_BUILDER: {
    enabled: true,
    description: 'Faculty mock test builder',
    allowedRoles: ['ROLE_FACULTY'],
  },
  STUDENT_ANALYTICS: {
    enabled: true,
    description: 'Faculty view of student analytics',
    allowedRoles: ['ROLE_FACULTY', 'ROLE_ADMIN'],
  },
  PAYMENT_GATEWAY: {
    enabled: false,
    description: 'Online payment processing',
    allowedRoles: ['ROLE_ADMIN'],
    rolloutPercentage: 0,
  },
  AUDIT_LOGS: {
    enabled: true,
    description: 'System audit trail',
    allowedRoles: ['ROLE_ADMIN'],
  },
  COUPON_SYSTEM: {
    enabled: true,
    description: 'Discount coupon management',
    allowedRoles: ['ROLE_ADMIN'],
  },
  NOTIFICATION_PUSH: {
    enabled: false,
    description: 'Push notification support',
    rolloutPercentage: 50,
  },
  DARK_MODE: {
    enabled: true,
    description: 'Dark theme support',
  },
  PWA_OFFLINE: {
    enabled: true,
    description: 'Offline mode via service worker',
  },
};

export function isFeatureEnabled(flagName: string, userRole?: string): boolean {
  const flag = FEATURE_FLAGS[flagName];
  if (!flag || !flag.enabled) return false;

  if (flag.allowedRoles && userRole) {
    return flag.allowedRoles.includes(userRole);
  }

  return true;
}
