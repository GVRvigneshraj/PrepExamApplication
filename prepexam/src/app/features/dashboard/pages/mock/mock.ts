import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

export interface MockTestStructure {
  id: string;
  title: string;
  type: 'mini' | 'full';
  subjects: string[];
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  status: 'available' | 'ongoing' | 'completed';
  progressPercent?: number;
  obtainedScore?: number;
}

@Component({
  selector: 'app-mock',
  imports: [CommonModule],
  templateUrl: './mock.html',
  styleUrl: './mock.scss',
})
export class Mock implements OnInit {

  activeTab = signal<'mini' | 'full'>('mini');
  mockExamsList = signal<MockTestStructure[]>([]);

  ngOnInit(): void {
    this.loadMockExaminationDatabase();
  }

  get exam(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedExam') || 'neet';
    }
    return 'neet';
  }

  private loadMockExaminationDatabase(): void {
    this.mockExamsList.set([
      {
        id: 'mock-1',
        title: 'Physics Mechanics Quick Recall',
        type: 'mini',
        subjects: ['Physics'],
        totalQuestions: 15,
        durationMinutes: 20,
        totalMarks: 60,
        status: 'available'
      },
      {
        id: 'mock-2',
        title: 'Organic Mechanisms Part-1',
        type: 'mini',
        subjects: ['Chemistry'],
        totalQuestions: 20,
        durationMinutes: 25,
        totalMarks: 80,
        status: 'ongoing',
        progressPercent: 65
      },
      {
        id: 'mock-3',
        title: 'High Yield Botany Evaluation',
        type: 'mini',
        subjects: ['Biology'],
        totalQuestions: 25,
        durationMinutes: 30,
        totalMarks: 100,
        status: 'completed',
        obtainedScore: 88
      },
      {
        id: 'mock-4',
        title: 'Full Length Practice Exam - 01',
        type: 'full',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        totalQuestions: 180,
        durationMinutes: 180,
        totalMarks: 720,
        status: 'available'
      },
      {
        id: 'mock-5',
        title: 'Full Length Practice Exam - 02',
        type: 'full',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        totalQuestions: 180,
        durationMinutes: 180,
        totalMarks: 720,
        status: 'completed',
        obtainedScore: 592
      }
    ]);
  }

  getFilterededTests(): MockTestStructure[] {
    return this.mockExamsList().filter(test => test.type === this.activeTab());
  }

  startMockTest(test: MockTestStructure): void {
    console.log(`Starting mock test template loop pipeline: ${test.id}`);
  }

  reviewResults(testId: string): void {
    console.log(`Displaying performance metrics review chart matrix for item: ${testId}`);
  }
}
