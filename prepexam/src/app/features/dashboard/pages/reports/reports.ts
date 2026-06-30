import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

export interface SubjectItem { subject: string; score: number; }
export interface MockItem { testName: string; score: number; }
export interface ImprovementArea { subject: string; topic: string; currentScore: number; actionPlan: string; }

export interface MinimalReportModel {
  assessmentsCompleted: number;
  totalAssessments: number;
  mockTestsCompleted: number;
  totalMocks: number;
  accuracy: number;
  dayStreak: number;
  subjectPerformance: SubjectItem[];
  mockPerformance: MockItem[];
  improvementAreas: ImprovementArea[];
}


@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {

  reportData = signal<MinimalReportModel>({
    assessmentsCompleted: 18,
    totalAssessments: 20,
    mockTestsCompleted: 6,
    totalMocks: 8,
    accuracy: 84,
    dayStreak: 14,
    subjectPerformance: [
      { subject: 'Mathematics', score: 92 },
      { subject: 'Physics', score: 85 },
      { subject: 'Chemistry', score: 68 },
      { subject: 'Verbal Ability', score: 74 }
    ],
    mockPerformance: [
      { testName: 'Mock Exam #1', score: 76 },
      { testName: 'Mock Exam #2', score: 81 },
      { testName: 'Mock Exam #3', score: 79 },
      { testName: 'Mock Exam #4', score: 88 }
    ],
    improvementAreas: [
      { subject: 'Chemistry', topic: 'Organic Mechanisms', currentScore: 68, actionPlan: 'Review modules and complete 15 targeted quiz subsets.' },
      { subject: 'Verbal', topic: 'Comprehension Pace', currentScore: 74, actionPlan: 'Run timed reading drills 20 minutes daily.' }
    ]
  });

  generationTime = computed(() => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  });
}