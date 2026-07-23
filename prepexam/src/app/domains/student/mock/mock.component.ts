import { CommonModule } from '@angular/common';
import { Component, computed, ChangeDetectorRef, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentMockService } from '../services/student-mock.service';
import { TestPage } from '../../../shared/components/test-page/test-page';
import { AppAlertService } from '../../../shared/services/alert.service';

export interface MockSeries {
  seriesId: number;
  seriesName: string;
  seriesCode: string;
  description: string;
  displayOrder: number;
  totalQuestions: number;
  durationMinutes: number;
  unlocked: boolean;
  attemptCount: number;
  averageAccuracy: number;
  highestAccuracy: number;
  latestAccuracy: number;
}

export interface MockSeriesResponse {
  examId: number;
  examName: string;
  series: MockSeries[];
  totalSeries: number;
  unlockedSeries: number;
  completedSeries: number;
}

@Component({
  selector: 'app-mock',
  standalone: true,
  imports: [CommonModule, TestPage],
  templateUrl: './mock.component.html',
  styleUrl: './mock.component.scss'
})
export class StudentMockComponent implements OnInit {

  @ViewChild('modalCard') modalCardRef?: ElementRef<HTMLElement>;
  @ViewChild('cancelButton') cancelButtonRef?: ElementRef<HTMLButtonElement>;

  constructor(
    private mockService: StudentMockService,
    private cdr: ChangeDetectorRef,
    private alertService: AppAlertService,
  ) {}

  // ── State ──
  activeTab = signal<'series' | 'mock' | 'pyq'>('series');
  seriesList = signal<MockSeries[]>([]);
  seriesMeta = signal<MockSeriesResponse | null>(null);
  isLoading = signal(false);
  loadingTitle = signal('');
  loadingSub = signal('');
  expandedSeries = signal<Set<number>>(new Set());

  // Test state
  isTestActive = false;
  activeTestData: any = null;
  testDuration = signal<number>(0);
  testBackLabel = signal<string>('Back to Mock');

  // History modal state
  showHistory = signal(false);
  historyLoading = signal(false);
  historyTitle = signal('');
  historyList = signal<any[]>([]);
  historyDetail = signal<any>(null);
  selectedAttempt = signal<any>(null);

  // Start confirmation state
  showStartConfirm = signal(false);
  closingStartConfirm = signal(false);
  pendingStartRequest = signal<any | null>(null);
  private lastFocusedElement: HTMLElement | null = null;
  private readonly bodyScrollClass = 'mock-modal-open';

  // ── Computed ──
  readonly headerStats = computed(() => {
    const meta = this.seriesMeta();
    return {
      total: meta?.totalSeries || 0,
      unlocked: meta?.unlockedSeries || 0,
      completed: meta?.completedSeries || 0,
    };
  });

  // ── Lifecycle ──
  ngOnInit(): void {
    this.loadMockSeries();
  }

  // ── API ──
  loadMockSeries(): void {
    this.isLoading.set(true);
    this.loadingTitle.set('Loading...');
    this.loadingSub.set('Fetching mock series');

    this.mockService.getMockSeriesList().subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res && res.success && res.data) {
          this.seriesMeta.set(res.data);
          this.seriesList.set(res.data.series || []);
          // Keep mock series cards compact by default and let the user expand them when needed
          this.expandedSeries.set(new Set<number>());
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Failed to load mock series:', err);
        this.cdr.detectChanges();
      }
    });
  }

  // ── Tab Navigation ──
  switchTab(tab: 'series' | 'mock' | 'pyq'): void {
    this.activeTab.set(tab);
  }

  // ── Series Expand/Collapse ──
  toggleSeries(seriesId: number): void {
    const current = new Set(this.expandedSeries());
    if (current.has(seriesId)) {
      current.delete(seriesId);
    } else {
      current.add(seriesId);
    }
    this.expandedSeries.set(current);
  }

  isExpanded(seriesId: number): boolean {
    return this.expandedSeries().has(seriesId);
  }

  // ── Test Start ──
  startSeriesTest(series: MockSeries, event: Event): void {
    event.stopPropagation();
    if (!series.unlocked) return;
    this.openStartConfirmation('MOCK_SERIES', series.seriesId, series.seriesName, series.durationMinutes, 'Back to Mock');
  }

  startSingleMock(): void {
    this.openStartConfirmation('MOCK', 0, 'Quick Mock Test', 45, 'Back to Mock');
  }

  startPyq(year: number): void {
    this.openStartConfirmation('PYQ', year, 'NEET ' + year + ' Paper', 180, 'Back to Mock');
  }

  openStartConfirmation(type: string, referenceId: number, testName: string, duration: number, backLabel: string): void {
    this.lastFocusedElement = document.activeElement as HTMLElement | null;
    this.pendingStartRequest.set({ type, referenceId, testName, duration, backLabel });
    this.closingStartConfirm.set(false);
    this.showStartConfirm.set(true);
    this.lockPageScroll(true);

    setTimeout(() => {
      const focusTarget = this.cancelButtonRef?.nativeElement || this.modalCardRef?.nativeElement;
      focusTarget?.focus();
    });
  }

  closeStartConfirmation(): void {
    if (!this.showStartConfirm()) return;
    this.closingStartConfirm.set(true);
    this.lockPageScroll(false);

    setTimeout(() => {
      this.showStartConfirm.set(false);
      this.closingStartConfirm.set(false);
      this.pendingStartRequest.set(null);
      this.lastFocusedElement?.focus?.();
    }, 220);
  }

  confirmStartTest(): void {
    const request = this.pendingStartRequest();
    if (!request) return;
    this.closeStartConfirmation();
    this.startUniversalTest(request.type, request.referenceId, request.testName, request.duration, request.backLabel);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.showStartConfirm()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeStartConfirmation();
      return;
    }

    if (event.key !== 'Tab') return;

    const card = this.modalCardRef?.nativeElement;
    if (!card) return;

    const focusable = Array.from(card.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled'));

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private startUniversalTest(type: string, referenceId: number, testName: string, duration: number, backLabel: string): void {
    this.showLoading('Starting Test...', 'Preparing questions for: ' + testName);

    this.mockService.startTest(type, referenceId).subscribe({
      next: (res: any) => {
        this.hideLoading();
        if (res && res.success && res.data) {
          const data = res.data;
          this.activeTestData = {
            success: true,
            data: {
              sessionId: data.assessmentId,
              sessionCode: data.paperCode || '',
              testName: testName,
              sessionToken: data.sessionToken,
              startTime: data.startTime,
              expiresAt: data.expiresAt,
              questions: (data.questions || []).map((q: any) => ({
                questionId: q.questionId,
                questionText: q.questionHtml || q.questionText,
                options: (q.options || []).map((o: any) => ({
                  optionId: o.id,
                  optionLabel: o.label || o.optionLabel,
                  optionText: o.html || o.text || o.optionText,
                })),
              })),
            }
          };
          this.testDuration.set(data.durationMinutes || duration);
          this.testBackLabel.set(backLabel);
          this.isTestActive = true;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.hideLoading();
        console.error('Failed to start test:', err);
        this.alertService.error('Failed to start test. Please try again.', 'Test Start Failed');
        this.cdr.detectChanges();
      }
    });
  }

  // ── Test Callbacks ──
  onTestComplete(event: any): void {
    this.isTestActive = false;
    this.activeTestData = null;
    this.loadMockSeries();
    this.cdr.detectChanges();
  }

  onTestCancel(): void {
    this.isTestActive = false;
    this.activeTestData = null;
    this.cdr.detectChanges();
  }

  // ── History ──
  openMockSeriesHistory(seriesId: number, title: string, event: Event): void {
    event.stopPropagation();
    this.historyTitle.set(title);
    this.historyList.set([]);
    this.historyDetail.set(null);
    this.historyLoading.set(true);
    this.showHistory.set(true);

    this.mockService.getSeriesDetail(seriesId).subscribe({
      next: (res: any) => {
        this.historyLoading.set(false);
        if (res && res.success && res.data) {
          this.historyDetail.set(res.data);
          this.historyList.set(res.data.attempts || []);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.historyLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

   openMockHistory(title: string, event: Event): void {
    event.stopPropagation();
    this.historyTitle.set(title);
    this.historyList.set([]);
    this.historyDetail.set(null);
    this.historyLoading.set(true);
    this.showHistory.set(true);

    this.mockService.getMockHistory().subscribe({
      next: (res: any) => {
        this.historyLoading.set(false);
        if (res && res.success && res.data) {
          this.historyList.set(Array.isArray(res.data) ? res.data : []);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.historyLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  retryFromHistory(): void {
    this.closeHistory();
  }

  closeHistory(): void {
    this.showHistory.set(false);
    this.selectedAttempt.set(null);
  }

  parseSummary(summary: string): string[] {
    if (!summary) return [];
    return summary.split('\n').filter(line => line.trim().length > 0).slice(0, 15);
  }

  // ── Helpers ──
  scoreClass(pct: number): string {
    if (pct >= 75) return 'good';
    if (pct >= 50) return 'avg';
    return 'low';
  }

  getScoreColor(pct: number): string {
    if (pct >= 75) return '#22c55e';
    if (pct >= 50) return '#f59e0b';
    return '#ef4444';
  }

  getScoreBg(pct: number): string {
    if (pct >= 75) return '#f0fdf4';
    if (pct >= 50) return '#fef3c7';
    return '#fef2f2';
  }

  getRingColor(pct: number): string {
    if (pct >= 75) return '#22c55e';
    if (pct >= 50) return '#f59e0b';
    return '#ef4444';
  }

  getRingBg(pct: number): string {
    if (pct >= 75) return '#dcfce7';
    if (pct >= 50) return '#fef3c7';
    return '#fee2e2';
  }

  getGrade(accuracy: number): string {
    if (accuracy >= 90) return 'A+';
    if (accuracy >= 80) return 'A';
    if (accuracy >= 70) return 'B+';
    if (accuracy >= 60) return 'B';
    if (accuracy >= 50) return 'C';
    return 'F';
  }

  getGradeColor(accuracy: number): string {
    if (accuracy >= 80) return '#22c55e';
    if (accuracy >= 60) return '#f59e0b';
    return '#ef4444';
  }

  private showLoading(title: string, sub: string): void {
    this.loadingTitle.set(title);
    this.loadingSub.set(sub);
    this.isLoading.set(true);
  }

  private hideLoading(): void {
    this.isLoading.set(false);
  }

  private lockPageScroll(lock: boolean): void {
    const body = document.body;
    if (lock) {
      body.classList.add(this.bodyScrollClass);
    } else {
      body.classList.remove(this.bodyScrollClass);
    }
  }
}
