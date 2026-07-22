import { CommonModule } from '@angular/common';
import { Component, computed, ChangeDetectorRef, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentMockService } from '../services/student-mock.service';
import { TestPage } from '../../../shared/components/test-page/test-page';

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

export interface ToastItem {
  id: string;
  msg: string;
  type: 'ok' | 'inf';
}

@Component({
  selector: 'app-mock',
  standalone: true,
  imports: [CommonModule, TestPage],
  templateUrl: './mock.component.html',
  styleUrl: './mock.component.scss'
})
export class StudentMockComponent implements OnInit {

  constructor(
    private mockService: StudentMockService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ── State ──
  activeTab = signal<'series' | 'mock' | 'pyq'>('series');
  seriesList = signal<MockSeries[]>([]);
  seriesMeta = signal<MockSeriesResponse | null>(null);
  isLoading = signal(false);
  loadingTitle = signal('');
  loadingSub = signal('');
  toasts = signal<ToastItem[]>([]);
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
          // Expand all unlocked series by default
          const expanded = new Set<number>();
          res.data.series?.forEach((s: MockSeries) => {
            if (s.unlocked) expanded.add(s.seriesId);
          });
          this.expandedSeries.set(expanded);
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
    this.startUniversalTest('MOCK_SERIES', series.seriesId, series.seriesName, series.durationMinutes, 'Back to Mock');
  }

  startSingleMock(): void {
    this.startUniversalTest('MOCK', 0, 'Quick Mock Test', 45, 'Back to Mock');
  }

  startPyq(year: number): void {
    this.startUniversalTest('PYQ', year, 'NEET ' + year + ' Paper', 180, 'Back to Mock');
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
        this.showToast('Failed to start test', 'inf');
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

  showToast(msg: string, type: 'ok' | 'inf' = 'inf'): void {
    const id = 'toast-' + Date.now();
    this.toasts.update(arr => [...arr, { id, msg, type }]);
    setTimeout(() => {
      this.toasts.update(arr => arr.filter(t => t.id !== id));
    }, 3000);
  }

  private showLoading(title: string, sub: string): void {
    this.loadingTitle.set(title);
    this.loadingSub.set(sub);
    this.isLoading.set(true);
  }

  private hideLoading(): void {
    this.isLoading.set(false);
  }
}
