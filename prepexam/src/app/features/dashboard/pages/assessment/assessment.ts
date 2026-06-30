import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestPage } from '../../shared/test-page/test-page'; // Verify this relative path correctly resolves to your TestPage file location
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}

export interface Chapter {
  id: number;
  name: string;
  unlocked: boolean;
  completed: boolean;
  progress: number;
  topicsCount: number;
  questionsCount: number;
  questions: Question[];
  isExpanded?: boolean;
}

export interface Subject {
  name: string;
  icon: string;
  color: string;
  totalChapters: number;
}
@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, TestPage],
  templateUrl: './assessment.html',
  styleUrl: './assessment.scss',
})
export class Assessment implements OnInit {
  selectedSubject = 'Physics';
  activeExamChapter: any | null = null;
  isExamActive = false;

  subjects: Subject[] = [
    { name: 'Physics', icon: 'fas fa-atom', color: '#3b82f6', totalChapters: 5 },
    { name: 'Chemistry', icon: 'fas fa-flask', color: '#a855f7', totalChapters: 5 },
    { name: 'Biology', icon: 'fas fa-dna', color: '#10b981', totalChapters: 5 }
  ];

  subjectData: { [key: string]: Chapter[] } = {};

  ngOnInit(): void {
    this.generateMockData();
  }

  generateMockData(): void {
    this.subjects.forEach(sub => {
      const chapters: Chapter[] = [];
      for (let i = 1; i <= 5; i++) {
        const questions: Question[] = Array.from({ length: 5 }, (_, qIdx) => ({
          id: qIdx + 1,
          text: `Which of the following principles best describes the fundamental mechanics framework item ${qIdx + 1} for ${sub.name} Chapter ${i}?`,
          options: ['Premium Correct Answer Option A', 'Alternative Analytical Option B', 'Theoretical Evaluation Option C', 'Experimental Control Option D'],
          correctAnswer: 0
        }));

        chapters.push({
          id: i,
          name: this.getChapterName(sub.name, i),
          unlocked: i === 1,
          completed: false,
          progress: i === 1 ? 40 : 0,
          topicsCount: 18,
          questionsCount: 5,
          questions,
          isExpanded: i === 1
        });
      }
      this.subjectData[sub.name] = chapters;
    });
  }

  getChapterName(subject: string, idx: number): string {
    const names: { [key: string]: string[] } = {
      'Physics': ['Units and Measurements', 'Kinematics', 'Laws of Motion', 'Work, Energy and Power', 'Motion of System of Particles'],
      'Chemistry': ['Some Basic Concepts', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'States of Matter'],
      'Biology': ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants']
    };
    return names[subject]?.[idx - 1] || `${subject} Chapter ${idx}`;
  }

  get currentChapters(): Chapter[] {
    return this.subjectData[this.selectedSubject] || [];
  }

  selectSubject(name: string): void {
    if (this.isExamActive) return;
    this.selectedSubject = name;
  }

  toggleChapter(chapter: Chapter): void {
    if (this.isExamActive) return;
    if (!chapter.unlocked) return;
    chapter.isExpanded = !chapter.isExpanded;
  }

  launchExam(chapter: Chapter, event: Event): void {
    event.stopPropagation();
    if (!chapter.unlocked || this.isExamActive) return;
    this.activeExamChapter = chapter;
    this.isExamActive = true;
  }

  onExamFinished(scorePercentage: any): void {
    if (!this.activeExamChapter) return;

    if (scorePercentage >= 80) {
      this.activeExamChapter.completed = true;
      this.activeExamChapter.progress = 100;

      const nextCh = this.currentChapters.find(c => c.id === this.activeExamChapter!.id + 1);
      if (nextCh) nextCh.unlocked = true;
    }

    this.isExamActive = false;
    this.activeExamChapter = null;
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return '#22c55e';
    if (progress >= 40) return '#f59e0b';
    return '#3b82f6';
  }
}
