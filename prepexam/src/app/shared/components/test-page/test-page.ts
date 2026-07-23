import { Component, EventEmitter, HostListener, Input, OnInit, Output, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestService } from '../../../core/services/test-service';
import { AppAlertService } from '../../services/alert.service';

declare var MathJax: any;

/* ── API Response Interfaces ── */

export interface AiReport {
  title: string;
  overallAnalysis: string;
  performanceSummary: string;
  subjectAnalysis: string;
  strengthAnalysis: string;
  weaknessAnalysis: string;
  comparisonAnalysis: string;
  recommendation: string;
  motivation: string;
  level: string;
  accuracy: number;
  score: number;
  summary: string;
  strongestArea: string;
  weakestArea: string;
}

export interface TestResultReport {
  assessmentId: number;
  paperCode: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  positiveMarks: number;
  negativeMarks: number;
  netScore: number;
  percentage: number;
  accuracy: number;
  averageTime: number;
  rank: number;
  grade: string;
  analysis: any;
}

interface TypingBubble {
  text: string;
  displayedText: string;
  isFullyTyped: boolean;
  isVisible: boolean;
}

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './test-page.html',
  styleUrl: './test-page.scss',
})
export class TestPage implements OnInit, AfterViewChecked, OnDestroy {

  @Input() chapterData?: any;
  @Input() durationMinutes?: number;
  @Input() backLabel: string = 'Back to Dashboard';
  @Output() onComplete = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  currentIndex = 0;
  activeQuestions: any[] = [];
  testTitle: string = 'Assessment Platform';
  subtitleLabel: string = 'Proctored Performance Session';
  sessionId!: number;
  sessionCode!: string;
  sessionToken: string = '';

  /* ── Global Timer ── */
  globalTimerSeconds: number = 0;
  globalTimerDisplay: string = '00:00:00';
  private globalTimerInterval: any = null;

  /* ── Per-question timer ── */
  private questionStartTime: number = Date.now();

  /* ── Submit state ── */
  isSubmittingTest = false;
  showExitWarningModal = false;

  /* ── AI Report panel ── */
  showAiReportPanel = false;
  examReport: TestResultReport | null = null;
  reviewData: any = null;

  /* ── AI Analyzing animation state ── */
  isAnalyzing = false;
  analyzePhase = 0;
  analyzeProgress = 0;
  private analyzeInterval: ReturnType<typeof setInterval> | null = null;
  private analyzeAnimationDone = false;
  private apiDataReady = false;
  private submitFailed = false;

  /* ── Typewriter state ── */
  aiAnalysisBubbles: TypingBubble[] = [];
  isAllTypingComplete = false;
  showDetailedLogsGrid = false;

  constructor(
    private testService: TestService,
    private cdr: ChangeDetectorRef,
    private alertService: AppAlertService,
  ) {}

  /* ══════════════════════════════════════════
     LIFECYCLE
     ══════════════════════════════════════════ */

  ngOnInit(): void {
    history.pushState(null, '', location.href);
    if (this.chapterData && this.chapterData.success && this.chapterData.data) {
      const examData = this.chapterData.data;
      this.activeQuestions = examData.questions || [];
      this.testTitle = examData.testName ? examData.testName.replace(/_/g, ' ') : 'Assessment Platform';
      this.subtitleLabel = `Session Ref: ${examData.sessionCode || examData.sessionToken || 'LIVE_TOKEN'}`;
      this.sessionId = examData.sessionId;
      this.sessionCode = examData.sessionCode || '';
      this.sessionToken = examData.sessionToken || '';
    }

    this.activeQuestions.forEach(q => {
      if (q.savedOptionId !== undefined && q.options) {
        q.userSelectedIndex = q.options.findIndex((o: any) => o.optionId === q.savedOptionId);
      } else {
        q.userSelectedIndex = undefined;
      }
      q.markedReviewState = q.markedForReview || false;
      q.timeTakenSeconds = 0;
    });
    this.resetQuestionTimer();

    // Start global timer if duration is provided
    if (this.durationMinutes && this.durationMinutes > 0) {
      this.globalTimerSeconds = this.durationMinutes * 60;
      this.updateTimerDisplay();
      this.globalTimerInterval = setInterval(() => {
        this.globalTimerSeconds--;
        this.updateTimerDisplay();
        this.cdr.detectChanges();
        if (this.globalTimerSeconds <= 0) {
          clearInterval(this.globalTimerInterval);
          this.autoSubmit();
        }
      }, 1000);
    }
  }

  ngAfterViewChecked(): void {
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
      MathJax.typesetPromise();
    }
  }

  ngOnDestroy(): void {
    this.clearAnalyzeAnimation();
    if (this.globalTimerInterval) {
      clearInterval(this.globalTimerInterval);
    }
  }

  private updateTimerDisplay(): void {
    const h = Math.floor(this.globalTimerSeconds / 3600);
    const m = Math.floor((this.globalTimerSeconds % 3600) / 60);
    const s = this.globalTimerSeconds % 60;
    this.globalTimerDisplay = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  private autoSubmit(): void {
    if (!this.isSubmittingTest && !this.showAiReportPanel) {
      this.submitExam();
    }
  }

  /* ══════════════════════════════════════════
     BROWSER GUARDS
     ══════════════════════════════════════════ */

  @HostListener('window:beforeunload', ['$event'])
  preventExitNotification($event: BeforeUnloadEvent): void {
    if (!this.showAiReportPanel) {
      $event.preventDefault();
      $event.returnValue = true;
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState($event: Event): void {
    if (!this.showAiReportPanel) {
      history.pushState(null, '', location.href);
      this.triggerExitVerification();
    }
  }

  /* ══════════════════════════════════════════
     GETTERS
     ══════════════════════════════════════════ */

  get currentQuestion(): any | null {
    return this.activeQuestions.length > 0 && this.currentIndex < this.activeQuestions.length
      ? this.activeQuestions[this.currentIndex] : null;
  }

  /* ══════════════════════════════════════════
     PER-QUESTION TIME TRACKING
     ══════════════════════════════════════════ */

  resetQuestionTimer(): void {
    this.questionStartTime = Date.now();
  }

  private saveCurrentQuestionTime(): void {
    if (this.currentQuestion) {
      const elapsed = Math.round((Date.now() - this.questionStartTime) / 1000);
      this.currentQuestion.timeTakenSeconds = (this.currentQuestion.timeTakenSeconds || 0) + elapsed;
    }
  }

  /* ══════════════════════════════════════════
     OPTION SELECTION — LOCAL ONLY, NO API CALL
     ══════════════════════════════════════════ */

  selectOption(idx: number): void {
    if (!this.currentQuestion || this.showAiReportPanel) return;
    this.saveCurrentQuestionTime();
    this.currentQuestion.userSelectedIndex = idx;
    this.resetQuestionTimer();
    this.saveAnswerToApi(this.currentQuestion, false);
    this.cdr.detectChanges();
  }

  toggleReviewMode(): void {
    if (!this.currentQuestion || this.showAiReportPanel) return;
    this.currentQuestion.markedReviewState = !this.currentQuestion.markedReviewState;
    this.saveAnswerToApi(this.currentQuestion, false);
    this.cdr.detectChanges();
  }

  private saveAnswerToApi(question: any, skipped: boolean): void {
    if (!this.sessionToken || !question.options) return;
    const selectedOption = question.userSelectedIndex !== undefined ? question.options[question.userSelectedIndex] : null;
    const payload = {
      sessionToken: this.sessionToken,
      questionId: question.questionId,
      selectedOptionId: selectedOption ? selectedOption.optionId : null,
      skipped: skipped,
      markedReview: question.markedReviewState || false,
      timeTaken: question.timeTakenSeconds || 0,
    };
    this.testService.saveAnswer(payload).subscribe({
      next: () => {},
      error: (err) => console.warn('Answer save failed:', err?.message),
    });
  }

  /* ══════════════════════════════════════════
     QUESTION NAVIGATION
     ══════════════════════════════════════════ */

  goToNext(): void {
    this.saveCurrentQuestionTime();
    if (this.currentIndex < this.activeQuestions.length - 1) {
      this.currentIndex++;
      this.resetQuestionTimer();
      this.cdr.detectChanges();
    }
  }

  goToPrev(): void {
    this.saveCurrentQuestionTime();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.resetQuestionTimer();
      this.cdr.detectChanges();
    }
  }

  jumpToQuestion(index: number): void {
    if (index >= 0 && index < this.activeQuestions.length) {
      this.saveCurrentQuestionTime();
      this.currentIndex = index;
      this.resetQuestionTimer();
      this.cdr.detectChanges();
    }
  }

  /* ══════════════════════════════════════════
     EXIT MODAL
     ══════════════════════════════════════════ */

  triggerExitVerification(): void {
    this.showExitWarningModal = true;
  }

  dismissExitVerification(): void {
    this.showExitWarningModal = false;
  }

  confirmExitAndDestroy(): void {
    this.showExitWarningModal = false;
    this.onCancel.emit();
  }

  /* ══════════════════════════════════════════
     BUILD SUBMIT PAYLOAD
     ══════════════════════════════════════════ */

  private buildSubmitAnswers(): any[] {
    this.saveCurrentQuestionTime();

    return this.activeQuestions
      .filter(q => q.userSelectedIndex !== undefined)
      .map(q => ({
        sessionId: this.sessionId,
        questionId: q.questionId,
        optionId: q.options[q.userSelectedIndex].optionId,
        timeTakenSeconds: q.timeTakenSeconds || 0,
        markedForReview: q.markedReviewState || false
      }));
  }

  /* ══════════════════════════════════════════
     SUBMIT TEST → ANALYZING ANIMATION → REPORT
     ══════════════════════════════════════════ */

  submitExam(): void {
    if (this.isSubmittingTest) return;
    this.isSubmittingTest = true;

    this.saveCurrentQuestionTime();

    // Reset all gatekeeper flags for this run
    this.analyzeAnimationDone = false;
    this.apiDataReady = false;
    this.submitFailed = false;

    this.isAnalyzing = true;
    this.showAiReportPanel = true;
    this.cdr.detectChanges();

    this.startAnalyzingAnimation(() => {
      this.analyzeAnimationDone = true;
      this.tryTransitionToReport();
    });

    // New API: submit just needs sessionToken
    const submitPayload = { sessionToken: this.sessionToken };

    this.testService.submitTest(submitPayload)
      .subscribe({
        next: (res: any) => {
          if (res && res.success && res.data) {
            this.examReport = res.data;
            this.fetchConversationalAiReview();
          } else {
            this.handleSubmissionFailure();
          }
        },
        error: (err) => {
          console.error('Submission failure:', err);
          this.handleSubmissionFailure();
        }
      });
  }

  fetchConversationalAiReview(): void {
    this.testService.getAiReview(this.sessionId)
      .subscribe({
        next: (res: any) => {
          if (res && res.success && res.data) {
            this.reviewData = res.data;
          }
          this.apiDataReady = true;
          this.tryTransitionToReport();
        },
        error: (err) => {
          // Silent fail — aiReport is already in submit response,
          // detailed logs grid is optional so no alert needed
          console.warn('Detailed review fetch skipped:', err?.message);
          this.apiDataReady = true;
          this.tryTransitionToReport();
        }
      });
  }

  /** Transitions to typewriter report only when BOTH animation and API are done */
  private tryTransitionToReport(): void {
    if (this.submitFailed) return;

    if (this.analyzeAnimationDone && this.apiDataReady) {
      this.clearAnalyzeAnimation();
      this.isAnalyzing = false;
      this.isSubmittingTest = false;
      this.cdr.detectChanges();
      this.prepareAiCommunicationStream();
    }
  }

  private handleSubmissionFailure(): void {
    this.submitFailed = true;
    this.isSubmittingTest = false;
    this.clearAnalyzeAnimation();
    this.isAnalyzing = false;
    this.showAiReportPanel = false;
    this.cdr.detectChanges();
    this.alertService.error('Error submitting test. Please check your network and retry.', 'Submission Failed');
  }

  /* ══════════════════════════════════════════
     AI ANALYZING ANIMATION ENGINE
     ══════════════════════════════════════════ */

  private startAnalyzingAnimation(onComplete: () => void): void {
    this.isAnalyzing = true;
    this.analyzePhase = 0;
    this.analyzeProgress = 0;
    this.cdr.detectChanges();

    const phase1End = 800;
    const phase2End = 2000;
    const phase3End = 3200;
    const totalDuration = 3800;
    const startTime = Date.now();

    this.analyzeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed < phase1End) {
        this.analyzePhase = 1;
      } else if (elapsed < phase2End) {
        this.analyzePhase = 2;
      } else if (elapsed < phase3End) {
        this.analyzePhase = 3;
      } else {
        this.analyzePhase = 4;
      }

      if (elapsed >= totalDuration) {
        this.analyzeProgress = 100;
        this.clearAnalyzeAnimation();
        setTimeout(() => onComplete(), 400);
      } else {
        const raw = elapsed / totalDuration;
        this.analyzeProgress = Math.min(95, Math.round(this.easeOutCubic(raw) * 100));
      }

      this.cdr.detectChanges();
    }, 50);
  }

  private clearAnalyzeAnimation(): void {
    if (this.analyzeInterval) {
      clearInterval(this.analyzeInterval);
      this.analyzeInterval = null;
    }
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  /* ══════════════════════════════════════════
     TYPEWRITER — READS FROM aiReport OBJECT
     ══════════════════════════════════════════ */

   async prepareAiCommunicationStream(): Promise<void> {
    if (!this.examReport) return;

    const report = this.examReport;
    const messages: string[] = [];

    // Build summary from the actual backend response
    messages.push(
      `Grade: ${report.grade} | Score: ${report.netScore} marks | ${report.correct}/${report.totalQuestions} correct`
    );
    messages.push(
      `Accuracy: ${report.accuracy}% | Attempted: ${report.attempted} | Skipped: ${report.skipped}`
    );
    if (report.analysis?.summary) {
      messages.push(report.analysis.summary);
    }

    this.aiAnalysisBubbles = messages.map(txt => ({
      text: txt,
      displayedText: '',
      isFullyTyped: false,
      isVisible: false
    }));
    this.isAllTypingComplete = false;
    this.showDetailedLogsGrid = false;
    this.cdr.detectChanges();

    for (let i = 0; i < this.aiAnalysisBubbles.length; i++) {
      this.aiAnalysisBubbles[i].isVisible = true;
      this.cdr.detectChanges();
      await this.streamSingleLine(this.aiAnalysisBubbles[i]);
    }

    this.isAllTypingComplete = true;
    this.cdr.detectChanges();
  }

  streamSingleLine(bubble: TypingBubble): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < bubble.text.length) {
          bubble.displayedText += bubble.text.charAt(index);
          index++;
          this.cdr.detectChanges();
        } else {
          clearInterval(timer);
          bubble.isFullyTyped = true;
          this.cdr.detectChanges();
          setTimeout(() => resolve(), 250);
        }
      }, 10);
    });
  }

  /* ══════════════════════════════════════════
     DETAILED LOGS
     ══════════════════════════════════════════ */

  toggleLogsExpansion(): void {
    this.showDetailedLogsGrid = true;
    this.cdr.detectChanges();
  }

  isOptionCorrect(question: any, option: any): boolean {
    return option.optionId === question.correctOptionId;
  }

  isOptionSelectedByStudent(question: any, option: any): boolean {
    return option.optionId === question.selectedOptionId;
  }

  closeAiDashboardView(): void {
    this.onComplete.emit({
      scorePercentage: this.examReport?.percentage || 0,
      sessionId: this.sessionId
    });
  }

  showReviewList(): void {
    this.showDetailedLogsGrid = true;
    this.cdr.detectChanges();
  }

  hideReviewList(): void {
    this.showDetailedLogsGrid = false;
    this.cdr.detectChanges();
  }

  getReviewCorrectCount(): number {
    if (!this.reviewData) return 0;
    return this.reviewData.filter((q: any) => q.isCorrect).length;
  }

  scoreClass(pct: number): string {
    if (pct >= 75) return 'good';
    if (pct >= 50) return 'avg';
    return 'low';
  }
}
