import { ExamConfig } from '../../../core/config/exam.config';

export const NEET_CONFIG: ExamConfig = {
  id: 'neet',
  name: 'NEET',
  color: '#4CAF50',
  logo: 'assets/icons/neet.svg',
  subjects: ['Physics', 'Chemistry', 'Biology'],
  hasNegativeMarking: true,
  negativeMarksPerWrong: -1,
  totalMarks: 720,
  durationMinutes: 200,
};
