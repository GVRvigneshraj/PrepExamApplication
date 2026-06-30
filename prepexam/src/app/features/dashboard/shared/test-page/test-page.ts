import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Chapter } from '../../pages/assessment/assessment';
import { CommonModule } from '@angular/common';
import { AssessmentQuestion, UniversalTestPayload } from '../../../../core/models/test-types';

@Component({
  selector: 'app-test-page',
  imports: [CommonModule],
  templateUrl: './test-page.html',
  styleUrl: './test-page.scss',
})
export class TestPage implements OnInit {
  // Support both inputs simultaneously
  @Input() chapterData?: Chapter;
  @Input() testPayload?: UniversalTestPayload;

  // Structured callback event emitter tracking completion metrics
  @Output() onComplete = new EventEmitter<any>();

  currentIndex = 0;
  activeQuestions: AssessmentQuestion[] = [];
  testTitle: string = 'Examination Assessment';
  subtitleLabel: string = 'Proctored Performance Session';

  ngOnInit(): void {
    // Determine which payload structure was supplied by the parent component layout view
    if (this.testPayload) {
      this.activeQuestions = this.testPayload.questions || [];
      this.testTitle = this.testPayload.title;
      this.subtitleLabel = this.testPayload.categoryLabel || 'Timed Simulator Test';
    } else if (this.chapterData) {
      this.activeQuestions = this.chapterData.questions || [];
      this.testTitle = this.chapterData.name;
      this.subtitleLabel = 'Chapter Evaluation Assignment';
    }

    // Reset user answers to allow clean attempts
    this.activeQuestions.forEach(q => q.selectedAnswer = undefined);
  }

  @HostListener('window:beforeunload', ['$event'])
  preventExitNotification($event: BeforeUnloadEvent): void {
    $event.preventDefault();
    $event.returnValue = true;
  }

  get currentQuestion(): AssessmentQuestion | null {
    if (this.activeQuestions.length > 0 && this.currentIndex < this.activeQuestions.length) {
      return this.activeQuestions[this.currentIndex];
    }
    return null;
  }

  selectOption(idx: number): void {
    if (this.currentQuestion) {
      this.currentQuestion.selectedAnswer = idx;
    }
  }

  goToNext(): void {
    if (this.currentIndex < this.activeQuestions.length - 1) {
      this.currentIndex++;
    }
  }

  goToPrev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  jumpToQuestion(index: number): void {
    if (index >= 0 && index < this.activeQuestions.length) {
      this.currentIndex = index;
    }
  }

  submitExam(): void {
    if (this.activeQuestions.length === 0) return;

    let correctCount = 0;
    this.activeQuestions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = (correctCount / this.activeQuestions.length) * 100;

    // Emit result tracking parameters back to parent dashboard page view logic hooks
    if (this.testPayload) {
      this.onComplete.emit({
        scorePercentage: scorePercentage,
        sourceId: this.testPayload.sourceId,
        testType: this.testPayload.testType
      });
    } else if (this.chapterData) {
      // Handles primitive parent callback expectations or custom mappings cleanly
      this.onComplete.emit({
        scorePercentage: scorePercentage,
        sourceId: this.chapterData.id,
        testType: 'chapter'
      });
    }
  }
}
