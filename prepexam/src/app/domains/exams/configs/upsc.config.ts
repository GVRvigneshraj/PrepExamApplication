import { ExamConfig } from '../../../core/config/exam.config';

export const UPSC_CONFIG: ExamConfig = {
  id: 'upsc',
  name: 'UPSC',
  color: '#FF9800',
  logo: 'assets/icons/upsc.svg',
  subjects: ['General Studies', 'CSAT', 'Optional Subject'],
  hasNegativeMarking: true,
  negativeMarksPerWrong: -0.33,
  totalMarks: 200,
  durationMinutes: 120,
};
