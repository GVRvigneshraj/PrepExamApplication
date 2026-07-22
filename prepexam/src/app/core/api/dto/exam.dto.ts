export interface ExamDto {
  id: string;
  name: string;
  logo: string;
  color: string;
  description?: string;
  isActive: boolean;
}

export interface SubjectDto {
  id: string;
  examId: string;
  name: string;
  icon?: string;
  order: number;
}

export interface ChapterDto {
  id: string;
  subjectId: string;
  name: string;
  order: number;
  topicCount: number;
}

export interface TopicDto {
  id: string;
  chapterId: string;
  name: string;
  order: number;
}

export interface QuestionDto {
  id: string;
  topicId: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}
