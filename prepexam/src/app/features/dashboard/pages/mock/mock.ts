import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { TestPage } from '../../shared/test-page/test-page';
import { AssessmentQuestion, UniversalTestPayload } from '../../../../core/models/test-types';

export interface AttemptLog {
  id: string;
  attemptDate: string;
  score: number;
  totalMarks: number;
  durationTakenMinutes: number;
  weaknesses: string[];
}

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
  attempts: AttemptLog[];
}

export interface PyqPaperStructure {
  id: string;
  year: number;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  status: 'available' | 'completed';
  bestScore?: number;
}

@Component({
  selector: 'app-mock',
  imports: [CommonModule,TestPage],
  templateUrl: './mock.html',
  styleUrl: './mock.scss',
})
export class Mock implements OnInit {
  // Navigation tabs view manager state controller track options: 'mock' | 'pyq'
  activeTrack = signal<'mock' | 'pyq'>('mock');
  activeTab = signal<'mini' | 'full'>('mini');

  mockTests = signal<MockTestStructure[]>([]);
  pyqPapers = signal<PyqPaperStructure[]>([]);

  // Orchestrator Workspace Node Variables
  activeTestingPayload: UniversalTestPayload | null = null;
  isTestingModeActive = false;

  ngOnInit(): void {
    this.initializeMockData();
    this.initializePyqData();
  }

  // Bottom Analytics Report Computations
  subjectWiseStrengthsReport = computed(() => {
    return [
      { subject: 'Physics', percentage: 76, status: 'Strong', color: '#22c55e' },
      { subject: 'Chemistry', percentage: 54, status: 'Moderate', color: '#f59e0b' },
      { subject: 'Biology', percentage: 38, status: 'Critical', color: '#ef4444' }
    ];
  });

  getFilterededTests(): MockTestStructure[] {
    return this.mockTests().filter(t => t.type === this.activeTab());
  }

  // Maps both tracking items into standard dynamic layout inputs
  launchDynamicTestInstance(type: 'mock' | 'pyq', examItem: any): void {
    // Generate dummy items dynamically for simulation environment matching
    const dynamicQuestions: AssessmentQuestion[] = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      text: `Evaluation assessment verification criteria statement item ${i + 1} for target test segment [${type.toUpperCase()}]?`,
      options: ['Structural Alternative Option Choice A', 'Conceptual Distractor Variant Parameter B', 'Hypothesis Test Matrix Option C', 'Variable Operational Parameter D'],
      correctAnswer: 0
    }));

    this.activeTestingPayload = {
      testType: type,
      sourceId: examItem.id,
      title: type === 'pyq' ? `${examItem.year} Official Paper Test` : examItem.title,
      categoryLabel: type === 'pyq' ? '5 Years Past Papers' : 'Realistic Mock Simulation Pack',
      durationMinutes: examItem.durationMinutes,
      questions: dynamicQuestions
    };

    this.isTestingModeActive = true;
  }

  handleDynamicTestResolution(result: { scorePercentage: number; sourceId: string; testType: string }): void {
    const rawMarksScored = Math.round((result.scorePercentage / 100) * 720);

    if (result.testType === 'mock') {
      this.mockTests.update(list => list.map(test => {
        if (test.id === result.sourceId) {
          test.status = 'completed';
          test.attempts.push({
            id: 'att-new-' + Date.now(),
            attemptDate: new Date().toISOString().split('T')[0],
            score: rawMarksScored,
            totalMarks: test.totalMarks,
            durationTakenMinutes: test.durationMinutes - 4,
            weaknesses: ['Review Flagged Items Grid Map']
          });
        }
        return test;
      }));
    } else {
      this.pyqPapers.update(list => list.map(paper => {
        if (paper.id === result.sourceId) {
          paper.status = 'completed';
          paper.bestScore = rawMarksScored;
        }
        return paper;
      }));
    }

    // Terminate engine instance overlay viewport
    this.isTestingModeActive = false;
    this.activeTestingPayload = null;
  }

  private initializeMockData(): void {
    this.mockTests.set([
      {
        id: 'mock-1',
        title: 'High Yield Physics Kinematics Evaluation',
        type: 'mini',
        subjects: ['Physics'],
        totalQuestions: 20,
        durationMinutes: 25,
        totalMarks: 80,
        status: 'available',
        attempts: [
          { id: 'att-old-1', attemptDate: '2026-06-12', score: 64, totalMarks: 80, durationTakenMinutes: 22, weaknesses: ['Projectile Mechanics'] }
        ]
      },
      {
        id: 'mock-4',
        title: 'Full Length Complete Practice Exam - 01',
        type: 'full',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        totalQuestions: 180,
        durationMinutes: 180,
        totalMarks: 720,
        status: 'available',
        attempts: []
      }
    ]);
  }

  private initializePyqData(): void {
    this.pyqPapers.set([
      { id: 'pyq-5', year: 2025, title: 'Official National Exam Core Paper 2025', totalQuestions: 180, durationMinutes: 180, totalMarks: 720, status: 'completed', bestScore: 590 },
      { id: 'pyq-4', year: 2024, title: 'Official National Exam Core Paper 2024', totalQuestions: 180, durationMinutes: 180, totalMarks: 720, status: 'available' },
      { id: 'pyq-3', year: 2023, title: 'Official National Exam Core Paper 2023', totalQuestions: 180, durationMinutes: 180, totalMarks: 720, status: 'available' },
      { id: 'pyq-2', year: 2022, title: 'Official National Exam Core Paper 2022', totalQuestions: 180, durationMinutes: 180, totalMarks: 720, status: 'available' },
      { id: 'pyq-1', year: 2021, title: 'Official National Exam Core Paper 2021', totalQuestions: 180, durationMinutes: 180, totalMarks: 720, status: 'available' }
    ]);
  }

  runPastReviewPreview(id: string): void {
    alert(`Opening detailed analysis preview modal window logs map tracking sequence instance: ${id}`);
  }
}
