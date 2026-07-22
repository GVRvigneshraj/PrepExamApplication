import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Onboardingservice } from '../../../core/services/onboardingservice';

/* ── API Response Interfaces ── */

interface QuestionOption {
  optionId: number;
  optionLabel: string;
  optionText: string;
  imageUrl: string | null;
}

interface Question {
  questionId: number;
  questionCode: string;
  subjectName: string;
  questionText: string;
  questionType: string;
  difficulty: string;
  estimatedTimeSeconds: number;
  hasImage: boolean;
  hasDiagram: boolean;
  hasFormula: boolean;
  options: QuestionOption[];
}

interface SubmitAnswer {
  sessionId: number;
  questionId: number;
  optionId: number;
  timeTakenSeconds: number;
  markedForReview: boolean;
}

interface AiReport {
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

interface ChatBubble {
  text: string;
  displayedText: string;
  isFullyTyped: boolean;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding implements OnInit, OnDestroy {
  currentStep: 'welcome' | 'step1' | 'step2' | 'assessment' | 'analysis' = 'welcome';
  isCreatingDashboard = false;

  /* ── AI Analyzing loader state ── */
  isAnalyzing = false;
  analyzePhase = 0;
  analyzeProgress = 0;
  private analyzeInterval: ReturnType<typeof setInterval> | null = null;

  /* ── Welcome chat messages ── */
  welcomeMessages: string[] = [
    "Hello there! Welcome to PrepExam, your AI-powered study companion. I'm here to help you crack your dream exam.",
    "I'll analyze your current level, create a personalized study plan, and guide you every step of the way. Let's make your preparation smart and effective!",
    'Shall we begin setting up your preparation journey?',
  ];

  analysisMessages: string[] = [];

  /* ── Typewriter state ── */
  activeBubbles: ChatBubble[] = [];
  isTypingComplete = false;

  /* ── Step 1-2 selection state ── */
  selectedExam: string | null = null;
  selectedTarget: string | null = null;
  ExamList: any[] = [];

  /* ── Assessment session data (from /test/start) ── */
  sessionId: number = 0;
  durationSeconds: number = 0;
  remainingSeconds: number = 0;
  questions: Question[] = [];
  questionslength: number = 0;
  currentQuestionIndex: number = 0;

  /* ── Answer tracking ── */
  userAnswers: { [key: number]: number } = {};
  submitAnswers: SubmitAnswer[] = [];
  markedForReviewSet: Set<number> = new Set();

  /* ── Timer ── */
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  /* ── Per-question time tracking ── */
  private questionViewStartTime: number = 0;

  /* ── Submission lock ── */
  private isSubmitting: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private onboardingService: Onboardingservice,
  ) {}

  /* ══════════════════════════════════════════
     LIFECYCLE
     ══════════════════════════════════════════ */

  ngOnInit(): void {
    this.getAllExamList();
    setTimeout(() => this.startChatFlow(this.welcomeMessages), 50);
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.clearAnalyzeAnimation();
  }

  /* ══════════════════════════════════════════
     EXAM LIST
     ══════════════════════════════════════════ */

  getAllExamList(): void {
    this.onboardingService.GetAllExamList().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.ExamList = res.data;
        } else {
          console.error('Failed to fetch exam list:', res.message);
        }
      },
      error: (err) => console.error('Error fetching exam list:', err),
    });
  }

  /* ══════════════════════════════════════════
     STEP NAVIGATION
     ══════════════════════════════════════════ */

  goToStep1(): void {
    this.currentStep = 'step1';
  }

  selectExam(examName: string): void {
    this.selectedExam = examName;
  }

  goToStep2(): void {
    if (this.selectedExam) this.currentStep = 'step2';
  }

  goBackToStep1(): void {
    this.currentStep = 'step1';
  }

  /* ══════════════════════════════════════════
     START ASSESSMENT → calls /test/start
     ══════════════════════════════════════════ */

  startAssessment(): void {
    if (!this.selectedTarget) return;
    this.getInitialTestQuestions(this.selectedExam);
  }

  getInitialTestQuestions(exam: any): void {
    const body: any = {
      testType: 'INITIAL_ASSESSMENT',
      referenceId: 0,
    };
    const initialSetupData = {
      selectedExam: exam,
      targetScore: this.selectedTarget,
    };

    this.onboardingService.UpdateInitialSetup(initialSetupData).subscribe({
      next: (res) => {
        if (res && res.success) {
          console.log('Initial setup updated successfully:', res);
        } else {
          console.error('Failed to update initial setup:', res.message);
        }
      },
      error: (err) => console.error('Error updating initial setup:', err),
    });

    this.onboardingService.GetInitialTestQuestions(body).subscribe({
      next: (res) => {
        const data = res?.data ? res.data : res;

        if (data && Array.isArray(data.questions) && data.questions.length > 0) {
          this.sessionId = data.sessionId;
          this.durationSeconds = data.durationSeconds;
          this.remainingSeconds = data.durationSeconds;
          this.questions = data.questions;
          this.questionslength = this.questions.length;
          this.currentQuestionIndex = 0;
          this.userAnswers = {};
          this.submitAnswers = [];
          this.markedForReviewSet.clear();

          this.currentStep = 'assessment';
          this.questionViewStartTime = Date.now();
          this.startTimer();
          this.cdr.detectChanges();

          console.log('Assessment session started:', {
            sessionId: this.sessionId,
            totalQuestions: this.questionslength,
            duration: this.durationSeconds,
          });
        } else {
          console.error('No questions returned from API:', res);
        }
      },
      error: (err) => console.error('Error fetching initial test questions:', err),
    });
  }

  /* ══════════════════════════════════════════
     TIMER
     ══════════════════════════════════════════ */

  get timerDisplay(): string {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private startTimer(): void {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        this.clearTimer();
        if (!this.isSubmitting) {
          this.submitTest();
        }
        return;
      }
      this.remainingSeconds--;
      if (this.remainingSeconds <= 60) {
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /* ══════════════════════════════════════════
     PER-QUESTION TIME TRACKING
     ══════════════════════════════════════════ */

  private getElapsedSeconds(): number {
    return Math.floor((Date.now() - this.questionViewStartTime) / 1000);
  }

  private updateTimeForCurrentQuestion(): void {
    if (this.questions.length === 0) return;
    const qId = this.questions[this.currentQuestionIndex].questionId;
    const elapsed = this.getElapsedSeconds();
    const entry = this.submitAnswers.find((a) => a.questionId === qId);
    if (entry) {
      entry.timeTakenSeconds = elapsed;
    }
  }

  /* ══════════════════════════════════════════
     OPTION SELECTION
     ══════════════════════════════════════════ */

  get currentSelectedAnswer(): number | null {
    return this.userAnswers[this.currentQuestionIndex] ?? null;
  }

  get isCurrentMarkedForReview(): boolean {
    if (this.questions.length === 0) return false;
    return this.markedForReviewSet.has(this.questions[this.currentQuestionIndex].questionId);
  }

  selectAnswer(questionId: number, optionId: number): void {
    this.userAnswers[this.currentQuestionIndex] = optionId;

    const elapsed = this.getElapsedSeconds();
    const existingIndex = this.submitAnswers.findIndex((a) => a.questionId === questionId);

    if (existingIndex !== -1) {
      this.submitAnswers[existingIndex].optionId = optionId;
      this.submitAnswers[existingIndex].timeTakenSeconds = elapsed;
    } else {
      this.submitAnswers.push({
        sessionId: this.sessionId,
        questionId: questionId,
        optionId: optionId,
        timeTakenSeconds: elapsed,
        markedForReview: this.markedForReviewSet.has(questionId),
      });
    }
  }

  toggleMarkForReview(): void {
    if (this.questions.length === 0) return;
    const qId = this.questions[this.currentQuestionIndex].questionId;

    if (this.markedForReviewSet.has(qId)) {
      this.markedForReviewSet.delete(qId);
    } else {
      this.markedForReviewSet.add(qId);
    }

    const entry = this.submitAnswers.find((a) => a.questionId === qId);
    if (entry) {
      entry.markedForReview = this.markedForReviewSet.has(qId);
    }

    this.cdr.detectChanges();
  }

  /* ══════════════════════════════════════════
     QUESTION NAVIGATION
     ══════════════════════════════════════════ */

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.updateTimeForCurrentQuestion();
      this.currentQuestionIndex--;
      this.questionViewStartTime = Date.now();
    } else {
      this.updateTimeForCurrentQuestion();
      this.clearTimer();
      this.currentStep = 'step2';
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questionslength - 1) {
      this.updateTimeForCurrentQuestion();
      this.currentQuestionIndex++;
      this.questionViewStartTime = Date.now();
    } else {
      this.updateTimeForCurrentQuestion();
      this.submitTest();
    }
  }

  /* ══════════════════════════════════════════
     SUBMIT TEST → AI ANIMATING → ANALYSIS
     ══════════════════════════════════════════ */

  submitTest(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.clearTimer();

    const body = {
      sessionId: this.sessionId,
      submitAnswers: this.submitAnswers,
    };

    console.log('Submitting test:', JSON.stringify(body, null, 2));

    this.onboardingService.submitInitialTestAnswers(body).subscribe({
      next: (res) => {
        if (res) {
          const data = res?.data ? res.data : res;
          console.log('Submit response:', data);

          const report: AiReport = data.aiReport || ({} as AiReport);

          // Pre-build messages from API response
          this.analysisMessages = this.buildAnalysisMessages(data, report);

          // Run the analyzing animation, then show results
          this.startAnalyzingAnimation(() => {
            this.isSubmitting = false;
            this.currentStep = 'analysis';
            this.cdr.detectChanges();

            setTimeout(() => this.startChatFlow(this.analysisMessages), 50);
          });
        } else {
          this.isSubmitting = false;
          console.error('Empty submit response received');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting test:', err);
      },
    });
  }

  /* ══════════════════════════════════════════
     AI ANALYZING ANIMATION
     ══════════════════════════════════════════ */

  private startAnalyzingAnimation(onComplete: () => void): void {
    this.isAnalyzing = true;
    this.analyzePhase = 0;
    this.analyzeProgress = 0;
    this.cdr.detectChanges();

    // Phase timing in ms
    const phase1End = 800;
    const phase2End = 2000;
    const phase3End = 3200;
    const totalDuration = 3800;

    const startTime = Date.now();

    this.analyzeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Advance phase
      if (elapsed < phase1End) {
        this.analyzePhase = 1;
      } else if (elapsed < phase2End) {
        this.analyzePhase = 2;
      } else if (elapsed < phase3End) {
        this.analyzePhase = 3;
      } else {
        this.analyzePhase = 4;
      }

      // Advance progress bar
      if (elapsed >= totalDuration) {
        this.analyzeProgress = 100;
        this.clearAnalyzeAnimation();

        setTimeout(() => {
          this.isAnalyzing = false;
          this.cdr.detectChanges();
          onComplete();
        }, 400);
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
     BUILD ANALYSIS MESSAGES FROM API
     ══════════════════════════════════════════ */

  private buildAnalysisMessages(data: any, report: AiReport): string[] {
    const messages: string[] = [];
    const score = data.score ?? 0;
    const total = data.totalQuestions ?? 0;
    const correct = data.correct ?? 0;
    const wrong = data.wrong ?? 0;
    const skipped = data.skipped ?? 0;
    const accuracy = data.accuracy ?? 0;
    const pct = data.percentage ?? 0;
    const level = report.level || 'N/A';

    // Title
    messages.push(
      report.title || `Assessment Complete — You scored ${score} out of ${total * 4} marks`,
    );

    // Overall analysis
    if (report.overallAnalysis) {
      messages.push(report.overallAnalysis);
    } else {
      messages.push(
        `You attempted ${data.attempted ?? 0} out of ${total} questions. ` +
          `Correct: ${correct} | Wrong: ${wrong} | Skipped: ${skipped}. ` +
          `Accuracy: ${(accuracy * 100).toFixed(1)}% — Level: ${level}`,
      );
    }

    // Performance summary
    if (report.performanceSummary) {
      messages.push(report.performanceSummary);
    }

    // Subject analysis
    if (report.subjectAnalysis) {
      messages.push(`Subject Analysis:\n${report.subjectAnalysis}`);
    }

    // Strengths
    if (report.strengthAnalysis) {
      messages.push(`Strengths:\n${report.strengthAnalysis}`);
    } else if (report.strongestArea) {
      messages.push(`Strongest Area: ${report.strongestArea}`);
    }

    // Weaknesses
    if (report.weaknessAnalysis) {
      messages.push(`Areas to Improve:\n${report.weaknessAnalysis}`);
    } else if (report.weakestArea) {
      messages.push(`Weakest Area: ${report.weakestArea}`);
    }

    // Comparison
    if (report.comparisonAnalysis) {
      messages.push(report.comparisonAnalysis);
    }

    // Score snapshot
    messages.push(
      `Score: ${score} | Percentage: ${pct.toFixed(1)}% | ` +
        `Accuracy: ${(accuracy * 100).toFixed(1)}% | Level: ${level}`,
    );

    // Recommendation
    if (report.recommendation) {
      messages.push(`Recommendation:\n${report.recommendation}`);
    }

    // Motivation
    if (report.motivation) {
      messages.push(report.motivation);
    }

    return messages;
  }

  /* ══════════════════════════════════════════
     DIFFICULTY BADGE HELPER
     ══════════════════════════════════════════ */

  getDifficultyClass(difficulty: string | undefined): string {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return 'diff-easy';
      case 'MEDIUM':
        return 'diff-medium';
      case 'HARD':
        return 'diff-hard';
      default:
        return 'color-secondary';
    }
  }

  /* ══════════════════════════════════════════
     TYPEWRITER ENGINE
     ══════════════════════════════════════════ */

  async startChatFlow(messages: string[]): Promise<void> {
    this.activeBubbles = [];
    this.isTypingComplete = false;
    this.cdr.detectChanges();

    for (const msg of messages) {
      const bubble: ChatBubble = {
        text: msg,
        displayedText: '',
        isFullyTyped: false,
      };
      this.activeBubbles.push(bubble);
      this.cdr.detectChanges();
      await this.typeText(bubble);
    }

    this.isTypingComplete = true;
    this.cdr.detectChanges();
  }

  private typeText(bubble: ChatBubble): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < bubble.text.length) {
          bubble.displayedText += bubble.text.charAt(index);
          index++;
          this.cdr.detectChanges();
        } else {
          clearInterval(interval);
          bubble.isFullyTyped = true;
          this.cdr.detectChanges();
          setTimeout(() => resolve(), 150);
        }
      }, 10);
    });
  }

  /* ══════════════════════════════════════════
     DASHBOARD REDIRECT
     ══════════════════════════════════════════ */

  buildDashboardAndRedirect(): void {
    this.isCreatingDashboard = true;
    setTimeout(() => {
      this.isCreatingDashboard = false;
      window.location.href = '/neet/dashboard';
    }, 3000);
  }
}
