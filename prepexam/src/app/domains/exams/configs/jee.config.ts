import { ExamConfig } from '../../../core/config/exam.config';

export const JEE_CONFIG: ExamConfig = {
  id: 'jee',
  name: 'JEE',
  color: '#2196F3',
  logo: 'assets/icons/jee.svg',
  subjects: ['Physics', 'Chemistry', 'Mathematics'],
  hasNegativeMarking: true,
  negativeMarksPerWrong: -1,
  totalMarks: 300,
  durationMinutes: 180,
};
