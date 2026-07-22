import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterModule, NavigationExtras } from '@angular/router';
import { StudentDashboardService } from '../services/student-dashboard.service';
import { DashboardApiResponse, DashboardTaskItem, DashboardTasks, TaskActionResponse } from '../../../core/api/dto/dashboard.dto';

interface QuickAction {
  label: string;
  icon: string;
  colorClass: string;
  route: string;
}

interface Subject {
  name: string;
  percent: number;
  color: string;
  bgColor: string;
  offset: number;
}

interface Chapter {
  name: string;
  percent: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class StudentDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('subsGrid') subsGrid!: ElementRef;
  @ViewChild('examCard') examCard!: ElementRef;

  greeting = '';

  user = {
    name: 'Student',
    level: 1,
    levelTitle: 'Beginner',
    xpCurrent: 0,
    xpTotal: 500,
    studyStreak: 0,
  };

  examScore = 0;
  examTotal = 720;
  weeklyChange = 0;

  tasks: DashboardTaskItem[] = [];
  totalTasks = 0;
  completedTasks = 0;
  totalStudyMinutes = 0;
  isLoading = true;

  // Real data from API
  learningData: any = null;
  performanceData: any = null;
  weakAreas: any = null;
  strongAreas: any = null;
  aiSummary: any = null;

  quickActions: QuickAction[] = [
    { label: 'Assessment', icon: 'fas fa-clipboard-check', colorClass: 'qa-assess', route: '/neet/assessment' },
    { label: 'Mock Test', icon: 'fas fa-file-circle-check', colorClass: 'qa-mock', route: '/neet/mock' },
    { label: 'Revision', icon: 'fas fa-rotate', colorClass: 'qa-revision', route: '/neet/revision' },
    { label: 'Reports', icon: 'fas fa-chart-column', colorClass: 'qa-report', route: '/neet/reports' }
  ];

  aiAdvice = '';

  subjects: Subject[] = [];
  weakChapters: Chapter[] = [];
  strongChapters: Chapter[] = [];

  private subsObserver!: IntersectionObserver;
  private examObserver!: IntersectionObserver;

  constructor(
    private dashService: StudentDashboardService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  get xpPercent(): number {
    if (this.user.xpTotal === 0) return 0;
    return Math.round((this.user.xpCurrent / this.user.xpTotal) * 100);
  }

  get scorePercent(): number {
    if (this.examTotal === 0) return 0;
    return Math.round((this.examScore / this.examTotal) * 100);
  }

  get weeklyPercent(): number {
    return Math.min(Math.round((this.weeklyChange / 50) * 100), 100);
  }

  get examRingOffset(): number {
    const c = 207.35;
    return c - (c * this.examScore) / this.examTotal;
  }

  get completedCount(): number {
    return this.completedTasks;
  }

  get totalTaskCount(): number {
    return this.totalTasks;
  }

  get taskProgress(): number {
    if (this.totalTaskCount === 0) return 0;
    return Math.round((this.completedCount / this.totalTaskCount) * 100);
  }

  ngOnInit(): void {
    this.greeting = this.getGreeting();

    // Check if returning from task action with updated todayTasks in router state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { todayTasks?: DashboardTasks } | null;
    if (state?.todayTasks) {
      this.updateTasksFromAction(state.todayTasks);
      this.isLoading = false;
      this.cdr.detectChanges();
    } else {
      this.loadDashboard();
    }
  }

  ngAfterViewInit(): void {
    this.initRingAnimations();
  }

  ngOnDestroy(): void {
    this.subsObserver?.disconnect();
    this.examObserver?.disconnect();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.dashService.getDashboard().subscribe({
      next: (res) => {
        console.log('[Dashboard] API response:', JSON.stringify(res, null, 2));
        if (res?.data) {
          this.mapDashboardData(res);
        } else {
          console.warn('[Dashboard] No data in response');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Dashboard] API error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mapDashboardData(res: DashboardApiResponse): void {
    const d = res.data;

    // Student
    this.user.name = d.student?.studentName ?? 'Student';
    console.log('[Dashboard] Student name mapped:', this.user.name);

    // Learning
    this.learningData = d.learning;
    this.user.level = d.learning?.currentLevel ?? 1;
    this.user.xpCurrent = d.learning?.currentXP ?? 0;
    this.user.xpTotal = d.learning?.nextLevelXP ?? 500;
    this.user.studyStreak = d.learning?.studyStreak ?? 0;
    this.user.levelTitle = this.getLevelTitle(this.user.level);

    // Performance
    this.performanceData = d.performance;
    this.examScore = Math.round(d.performance?.overallAverageScore ?? 0);
    this.weeklyChange = Math.round(d.performance?.overallPerformancePercentage ?? 0);

    // Subject Performance (real data from API)
    const subjectColors: Record<string, { color: string; bgColor: string }> = {
      'Physics':   { color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)' },
      'Chemistry': { color: '#10b981', bgColor: 'rgba(16,185,129,0.1)' },
      'Biology':   { color: '#3b82f6', bgColor: 'rgba(59,130,246,0.1)' },
    };

    console.log('[Dashboard] Subject performance data:', d.subjectPerformance);

    this.subjects = (d.subjectPerformance ?? []).map(sp => {
      const colors = subjectColors[sp.subjectName] ?? { color: '#7c5cfc', bgColor: 'rgba(124,92,252,0.1)' };
      return {
        name: sp.subjectName,
        percent: Math.round(sp.percentage),
        color: colors.color,
        bgColor: colors.bgColor,
        offset: this.calcRingOffset(Math.round(sp.percentage)),
      };
    });

    console.log('[Dashboard] Mapped subjects:', this.subjects);

    // Tasks (from dashboard API directly)
    const taskData = d.tasks;
    this.tasks = taskData?.tasks ?? [];
    this.totalTasks = taskData?.totalTasks ?? this.tasks.length;
    this.completedTasks = taskData?.completedTasks ?? 0;
    this.totalStudyMinutes = taskData?.totalStudyMinutes ?? 0;

    // Weak / Strong areas
    if (d.weakAreas?.chapter && d.weakAreas.chapter !== 'N/A') {
      this.weakChapters = [{ name: d.weakAreas.chapter, percent: 0 }];
    } else {
      this.weakChapters = [];
    }

    if (d.strongAreas?.chapter && d.strongAreas.chapter !== 'N/A') {
      this.strongChapters = [{ name: d.strongAreas.chapter, percent: 0 }];
    } else {
      this.strongChapters = [];
    }

    // AI Summary
    if (d.aiSummary) {
      this.aiSummary = d.aiSummary;
      this.aiAdvice = `<strong>${d.aiSummary.title}</strong> — ${d.aiSummary.summary} ${d.aiSummary.recommendation}`;
    }

    console.log('[Dashboard] All data mapped. Triggering change detection.');
    this.cdr.detectChanges();
  }

  startLesson(task: DashboardTaskItem): void {
    if (task.taskType === 'CHAPTER_LESSON' && task.referenceId) {
      this.dashService.startTask(task.taskId).subscribe(() => {
        this.router.navigate(['../', 'assessment'], {
          relativeTo: this.route,
          queryParams: { chapterId: task.referenceId, taskId: task.taskId, action: 'lesson', direct: 'true' }
        });
      });
    }
  }

  startTest(task: DashboardTaskItem): void {
    if (task.taskType === 'CHAPTER_TEST' && task.referenceId) {
      this.dashService.startTask(task.taskId).subscribe(() => {
        this.router.navigate(['../', 'assessment'], {
          relativeTo: this.route,
          queryParams: { chapterId: task.referenceId, taskId: task.taskId, action: 'test', direct: 'true' }
        });
      });
    }
  }

  skipTask(task: DashboardTaskItem): void {
    this.dashService.skipTask(task.taskId).subscribe((res) => {
      if (res?.data?.todayTasks) {
        this.updateTasksFromAction(res.data.todayTasks);
      } else {
        this.loadDashboard();
      }
    });
  }

  updateTasksFromAction(todayTasks: DashboardTasks): void {
    this.tasks = todayTasks.tasks ?? [];
    this.totalTasks = todayTasks.totalTasks ?? this.tasks.length;
    this.completedTasks = todayTasks.completedTasks ?? 0;
    this.totalStudyMinutes = todayTasks.totalStudyMinutes ?? 0;
    this.cdr.detectChanges();
  }

  onViewAdvice(): void {
    this.router.navigate(['../', 'ai-chat'], { relativeTo: this.route });
  }

  private getGreeting(): string {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Good Morning';
    if (h >= 12 && h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  private getLevelTitle(level: number): string {
    if (level >= 15) return 'Expert';
    if (level >= 10) return 'Advanced';
    if (level >= 5) return 'Intermediate';
    return 'Beginner';
  }

  private calcRingOffset(percent: number): number {
    const circumference = 163.36;
    return circumference - (circumference * percent) / 100;
  }

  isTaskDone(task: DashboardTaskItem): boolean {
    return task.taskStatus === 'COMPLETED' || task.taskStatus === 'SKIPPED';
  }

  isTaskInProgress(task: DashboardTaskItem): boolean {
    return task.taskStatus === 'IN_PROGRESS';
  }

  isTaskSkipped(task: DashboardTaskItem): boolean {
    return task.taskStatus === 'SKIPPED';
  }

  getTaskTitleShort(task: DashboardTaskItem): string {
    return task.title
      .replace(/^(Physics|Chemistry|Biology)\s*-\s*/, '')
      .replace(/\s*(Lesson|Test)$/i, '')
      .trim();
  }

  getSubjectColor(subjectName: string | null): string {
    switch (subjectName) {
      case 'Physics':   return '#f59e0b';
      case 'Chemistry': return '#10b981';
      case 'Biology':   return '#3b82f6';
      default:          return '#7c5cfc';
    }
  }

  private initRingAnimations(): void {
    this.subsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rings = entry.target.querySelectorAll('.rf') as NodeListOf<SVGCircleElement>;
          rings.forEach(ring => {
            const final = ring.getAttribute('stroke-dashoffset');
            ring.style.strokeDashoffset = '163.36';
            requestAnimationFrame(() => {
              ring.style.transition = 'stroke-dashoffset 1.2s ease';
              ring.style.strokeDashoffset = final || '0';
            });
          });
          this.subsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (this.subsGrid?.nativeElement) {
      this.subsObserver.observe(this.subsGrid.nativeElement);
    }

    this.examObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ring = entry.target.querySelector('circle:nth-child(2)') as SVGCircleElement;
          if (ring) {
            const final = ring.getAttribute('stroke-dashoffset');
            ring.style.strokeDashoffset = '207.35';
            requestAnimationFrame(() => {
              ring.style.transition = 'stroke-dashoffset 1.4s ease';
              ring.style.strokeDashoffset = final || '0';
            });
          }
          this.examObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (this.examCard?.nativeElement) {
      this.examObserver.observe(this.examCard.nativeElement);
    }
  }
}
