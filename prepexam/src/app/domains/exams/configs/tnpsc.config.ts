import { ExamConfig } from '../../../core/config/exam.config';

export const TNPSC_CONFIG: ExamConfig = {
  id: 'tnpsc',
  name: 'TNPSC',
  color: '#9C27B0',
  logo: 'assets/icons/tnpsc.svg',
  subjects: ['General Studies', 'Aptitude', 'Language'],
  hasNegativeMarking: false,
  negativeMarksPerWrong: 0,
  totalMarks: 300,
  durationMinutes: 180,
};
