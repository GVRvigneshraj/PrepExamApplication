import { ExamConfig } from '../../../core/config/exam.config';

export const RAILWAY_CONFIG: ExamConfig = {
  id: 'railway',
  name: 'Railway',
  color: '#F44336',
  logo: 'assets/icons/railway.svg',
  subjects: ['General Awareness', 'Mathematics', 'Reasoning', 'Science'],
  hasNegativeMarking: true,
  negativeMarksPerWrong: -0.33,
  totalMarks: 100,
  durationMinutes: 90,
};
