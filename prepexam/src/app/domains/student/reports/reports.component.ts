import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ReportsService } from '../services/student-reports.service';


// ─── Interfaces ───────────────────────────────────────────────
export interface OverallSummary {
  overallAccuracy: number;
  overallPercentage: number;
  overallQuestions: number;
  overallCorrect: number;
  overallWrong: number;
  overallSkipped: number;
  overallStudyHours: number;
}
export interface SubjectAnalysis {
  subjectId: number;
  subjectName: string;
  accuracy: number;
  progress: number;
  attempts: number;
  bestScore: number;
  lastScore: number;
  timeSpent: number;
}
export interface ChapterAnalysis {
  chapterId: number;
  chapterName: string;
  subjectName: string;
  attemptCount: number;
  accuracy: number;
  completion: number;
  lastAttempt: string;
}
export interface TopicAnalysis {
  topicId: number;
  topicName: string;
  chapterName: string;
  accuracy: number;
  mastered: boolean;
  needsRevision: boolean;
}
export interface MockAnalysis {
  attempts: number;
  bestScore: number;
  averageScore: number;
  highestRank: number;
}
export interface MockSeriesAnalysis {
  seriesName: string;
  seriesCode: string;
  completion: number;
  average: number;
  unlocked: boolean;
}
export interface PyqAnalysis {
  year: number;
  accuracy: number;
  attempts: number;
}
export interface RevisionAnalysis {
  wrongQuestions: number;
  reviewQuestions: number;
  pendingRevision: number;
  completedRevision: number;
}
export interface TrendPoint {
  date: string;
  accuracy: number;
  studyMinutes: number;
  questionsAttempted: number;
}
export interface PerformanceTrend {
  last7Days: TrendPoint[];
  last30Days: TrendPoint[];
  last90Days: TrendPoint[];
}
export interface TimeAnalysis {
  avgTimePerQuestion: number;
  fastestSubject: string;
  slowestSubject: string;
}
export interface StrongWeakAreas {
  topSubjects: string[];
  topChapters: string[];
  topTopics: string[];
}
export interface Leaderboard {
  instituteRank: number;
  overallRank: number;
  percentile: number;
}
export interface LevelHistory {
  level: number;
  date: string;
}
export interface XpHistory {
  xp: number;
  date: string;
}
export interface Achievements {
  badges: number;
  levelHistory: LevelHistory[];
  xpHistory: XpHistory[];
}
export interface AiSummary {
  performanceSummary: string;
  weakness: string;
  strength: string;
  recommendedChapters: string[];
  recommendedMock: string;
  estimatedNEETScore: number;
  estimatedAIR: number;
}
export interface ReportData {
  overallSummary: OverallSummary;
  subjectAnalysis: SubjectAnalysis[];
  chapterAnalysis: ChapterAnalysis[];
  topicAnalysis: TopicAnalysis[];
  mockAnalysis: MockAnalysis;
  mockSeriesAnalysis: MockSeriesAnalysis[];
  pyqAnalysis: PyqAnalysis[];
  revisionAnalysis: RevisionAnalysis;
  performanceTrend: PerformanceTrend;
  timeAnalysis: TimeAnalysis;
  strongAreas: StrongWeakAreas;
  weakAreas: StrongWeakAreas;
  leaderboard: Leaderboard;
  achievements: Achievements;
  aiSummary: AiSummary;
}
export interface ReportResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: ReportData;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class StudentReportsComponent implements OnInit, AfterViewInit {

  constructor(
    private reportsService: ReportsService,
    private cdr: ChangeDetectorRef
  ) {}

  reportData: ReportResponse | null = null;

  /** Shorthand getter — only call after reportData is loaded */
  get d(): ReportData {
    return this.reportData!.data;
  }

  get ts(): string {
    return this.reportData!.timestamp;
  }
  isLoading = true;

  /** SVG ring constants */
  readonly RING_RADIUS = 80;
  readonly CIRCUMFERENCE = 2 * Math.PI * 80; // ≈502.65

  /** Trend tab state */
  activeTrendTab: '7' | '30' | '90' = '30';

  /** Animated counter values */
  av: Record<string, number> = {};

  /** Expand/collapse state for lists */
  chaptersExpanded = false;
  topicsExpanded = false;

  Math = Math;

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.reportsService.getReports().subscribe({
      next: (res: ReportResponse) => {
        console.log('[Reports] API response:', JSON.stringify(res, null, 2));
        if (res?.success && res.data) {
          this.reportData = res;
        } else {
          console.warn('[Reports] No data in response');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.animateCounters(), 100);
      },
      error: (err) => {
        console.error('[Reports] API error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.reportData) {
      this.animateCounters();
    }
  }

  // ─── Animated Counters ──────────────────────────────────────
  private animateCounters(): void {
    const d = this.d;
    this.av = {
      overallPercentage: d.overallSummary.overallPercentage,
      overallQuestions: d.overallSummary.overallQuestions,
      overallCorrect: d.overallSummary.overallCorrect,
      overallWrong: d.overallSummary.overallWrong,
      overallSkipped: d.overallSummary.overallSkipped,
      overallStudyHours: d.overallSummary.overallStudyHours,
      mockAttempts: d.mockAnalysis.attempts,
      mockBest: d.mockAnalysis.bestScore,
      mockAvg: d.mockAnalysis.averageScore,
      mockRank: d.mockAnalysis.highestRank,
      instituteRank: d.leaderboard.instituteRank,
      overallRank: d.leaderboard.overallRank,
      percentile: d.leaderboard.percentile,
      badges: d.achievements.badges,
      estScore: d.aiSummary.estimatedNEETScore,
      estAIR: d.aiSummary.estimatedAIR,
      avgTime: d.timeAnalysis.avgTimePerQuestion,
    };
    this.cdr.detectChanges();
  }

  // ─── SVG Ring Helpers ───────────────────────────────────────
  getDashOffset(percentage: number): number {
    return this.CIRCUMFERENCE * (1 - percentage / 100);
  }

  // ─── Trend Chart Helpers ────────────────────────────────────
  get currentTrendData(): TrendPoint[] {
    const trend = this.d.performanceTrend;
    if (this.activeTrendTab === '7') return trend.last7Days;
    if (this.activeTrendTab === '30') return trend.last30Days;
    return trend.last90Days;
  }

  getTrendPoints(w = 600, h = 200): string {
    const data = this.currentTrendData;
    if (!data || data.length < 2) return '';
    const pad = 20;
    const cw = w - pad * 2;
    const ch = h - pad * 2;
    return data
      .map((d, i) => {
        const x = pad + (i / (data.length - 1)) * cw;
        const y = pad + ch - (d.accuracy / 100) * ch;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  getAreaPoints(w = 600, h = 200): string {
    const data = this.currentTrendData;
    if (!data || data.length < 2) return '';
    const linePoints = this.getTrendPoints(w, h);
    const lastX = 580;
    return `20,180 ${linePoints} ${lastX},180`;
  }

  switchTrendTab(tab: '7' | '30' | '90'): void {
    this.activeTrendTab = tab;
  }

  // ─── Utility Helpers ────────────────────────────────────────
  getAccuracyClass(val: number): string {
    if (val >= 80) return 'acc-high';
    if (val >= 60) return 'acc-mid';
    return 'acc-low';
  }

  getAccuracyColor(val: number): string {
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#f59e0b';
    return '#f43f5e';
  }

  formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  formatShortDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  getTrendPoint(index: number): TrendPoint {
    return this.currentTrendData[index];
  }

  // ─── Expand/Collapse Helpers ────────────────────────────────
  get visibleChapters() {
    return this.chaptersExpanded ? this.d.chapterAnalysis : this.d.chapterAnalysis.slice(0, 5);
  }

  get visibleTopics() {
    return this.topicsExpanded ? this.d.topicAnalysis : this.d.topicAnalysis.slice(0, 5);
  }

  get hasMoreChapters(): boolean {
    return this.d.chapterAnalysis.length > 5;
  }

  get hasMoreTopics(): boolean {
    return this.d.topicAnalysis.length > 5;
  }

  toggleChapters(): void {
    this.chaptersExpanded = !this.chaptersExpanded;
  }

  toggleTopics(): void {
    this.topicsExpanded = !this.topicsExpanded;
  }
}
