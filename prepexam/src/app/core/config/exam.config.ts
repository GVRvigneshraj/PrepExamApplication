export interface ExamConfig {
  id: string;
  name: string;
  color: string;
  logo: string;
  subjects: string[];
  hasNegativeMarking: boolean;
  negativeMarksPerWrong: number;
  totalMarks: number;
  durationMinutes: number;
}

export const EXAM_CONFIGS: Record<string, ExamConfig> = {
  neet: {
    id: 'neet',
    name: 'NEET',
    color: '#4CAF50',
    logo: 'assets/icons/neet.svg',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    hasNegativeMarking: true,
    negativeMarksPerWrong: -1,
    totalMarks: 720,
    durationMinutes: 200,
  },
  jee: {
    id: 'jee',
    name: 'JEE',
    color: '#2196F3',
    logo: 'assets/icons/jee.svg',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    hasNegativeMarking: true,
    negativeMarksPerWrong: -1,
    totalMarks: 300,
    durationMinutes: 180,
  },
  upsc: {
    id: 'upsc',
    name: 'UPSC',
    color: '#FF9800',
    logo: 'assets/icons/upsc.svg',
    subjects: ['General Studies', 'CSAT', 'Optional Subject'],
    hasNegativeMarking: true,
    negativeMarksPerWrong: -0.33,
    totalMarks: 200,
    durationMinutes: 120,
  },
  tnpsc: {
    id: 'tnpsc',
    name: 'TNPSC',
    color: '#9C27B0',
    logo: 'assets/icons/tnpsc.svg',
    subjects: ['General Studies', 'Aptitude', 'Language'],
    hasNegativeMarking: false,
    negativeMarksPerWrong: 0,
    totalMarks: 300,
    durationMinutes: 180,
  },
  railway: {
    id: 'railway',
    name: 'Railway',
    color: '#F44336',
    logo: 'assets/icons/railway.svg',
    subjects: ['General Awareness', 'Mathematics', 'Reasoning', 'Science'],
    hasNegativeMarking: true,
    negativeMarksPerWrong: -0.33,
    totalMarks: 100,
    durationMinutes: 90,
  },
  ssc: {
    id: 'ssc',
    name: 'SSC',
    color: '#00BCD4',
    logo: 'assets/icons/ssc.svg',
    subjects: ['General Intelligence', 'Quantitative Aptitude', 'English', 'General Awareness'],
    hasNegativeMarking: true,
    negativeMarksPerWrong: -0.5,
    totalMarks: 200,
    durationMinutes: 120,
  },
  banking: {
    id: 'banking',
    name: 'Banking',
    color: '#3F51B5',
    logo: 'assets/icons/banking.svg',
    subjects: ['Reasoning', 'Quantitative Aptitude', 'English Language', 'General Awareness', 'Computer Knowledge'],
    hasNegativeMarking: true,
    negativeMarksPerWrong: -0.25,
    totalMarks: 200,
    durationMinutes: 120,
  },
  defence: {
    id: 'defence',
    name: 'Defence',
    color: '#795548',
    logo: 'assets/icons/defence.svg',
    subjects: ['General Knowledge', 'Mathematics', 'English', 'Physics', 'Chemistry'],
    hasNegativeMarking: true,
    negativeMarksPerWrong: -0.33,
    totalMarks: 300,
    durationMinutes: 150,
  },
  state: {
    id: 'state',
    name: 'State Exams',
    color: '#607D8B',
    logo: 'assets/icons/state.svg',
    subjects: ['General Studies', 'Aptitude', 'Reasoning', 'Language'],
    hasNegativeMarking: false,
    negativeMarksPerWrong: 0,
    totalMarks: 300,
    durationMinutes: 180,
  },
};
