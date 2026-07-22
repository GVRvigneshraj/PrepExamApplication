import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestPage } from '../../../shared/components/test-page/test-page';
import { LessonPlayerComponent } from '../../../shared/components/lesson-player/lesson-player.component';
import { AssessmentService } from '../../../core/services/assessment-service';
import { TestService } from '../../../core/services/test-service';
import { StorageService } from '../../../core/services/storage.service';
import { StudentDashboardService } from '../services/student-dashboard.service';

export interface Topic {
  id: number;
  name: string;
  questionCount: number;
  locked?: boolean;
}

export interface Chapter {
  id: number;
  name: string;
  unlocked: boolean;
  completed: boolean;
  progress: number;
  topicsCount: number;
  questionsCount: number;
  topics: Topic[];
  isExpanded?: boolean;
}

export interface Unit {
  id: number;
  name: string;
  code: string;
  displayOrder: number;
  totalChapters: number;
  totalTopics: number;
  totalQuestions: number;
  progress: number;
  unlocked: boolean;
  completed: boolean;
  chapters: Chapter[];
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  icon: string;
  color: string;
  units: Unit[];
}

@Component({
  selector: 'app-student-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, TestPage, LessonPlayerComponent],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class StudentAssessmentComponent implements OnInit {

  constructor(
    private testService: TestService,
    private assessmentService: AssessmentService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private dashService: StudentDashboardService
  ) {}

  subjects: Subject[] = [];
  selectedSubject = '';
  currentChapters: Chapter[] = [];
  activeExamChapter: any = null;
  isExamActive = false;
  isDirectMode = false;
  directTaskId = 0;

  isconformationpopup = false;
  pendingLaunchChapter: Chapter | null = null;

  // Lesson Player
  showLessonPlayer = false;
  lessonChapterName = '';
  lessonTopicName = '';
  lessonTopicId = 0;

  ngOnInit(): void {
    this.loadAssessment();
  }

  loadAssessment(): void {
    const chapterId = Number(this.route.snapshot.queryParamMap.get('chapterId'));
    const action = this.route.snapshot.queryParamMap.get('action');
    this.isDirectMode = this.route.snapshot.queryParamMap.get('direct') === 'true';
    this.directTaskId = Number(this.route.snapshot.queryParamMap.get('taskId')) || 0;

    this.assessmentService.getAssessment().subscribe({
      next: (res: any) => {
        if (res && res.success && res.data && res.data.subjects) {
          this.subjects = res.data.subjects.map((s: any) => ({
            id: s.subjectId,
            name: s.subjectName,
            code: s.subjectName.substring(0, 3).toUpperCase(),
            icon: this.getSubjectIcon(s.subjectName),
            color: this.getSubjectColor(s.subjectName),
            units: [{
              id: 0,
              name: s.subjectName,
              code: s.subjectName.substring(0, 3).toUpperCase(),
              displayOrder: 0,
              totalChapters: s.totalChapters || 0,
              totalTopics: 0,
              totalQuestions: 0,
              progress: s.overallProgress || 0,
              unlocked: true,
              completed: false,
              chapters: (s.chapters || []).map((ch: any) => ({
                id: ch.chapterId,
                name: ch.chapterName,
                unlocked: ch.unlocked !== false,
                completed: ch.completed || false,
                progress: ch.averagePercentage || 0,
                topicsCount: ch.topics?.length || 0,
                questionsCount: ch.topics?.reduce((sum: number, t: any) => sum + (t.questionCount || 0), 0) || 0,
                topics: (ch.topics || []).map((t: any) => ({
                  id: t.topicId,
                  name: t.topicName,
                  questionCount: t.questionCount || 0,
                  locked: t.locked || false,
                })),
                isExpanded: false,
              }))
            }]
          }));

          if (this.subjects.length > 0) {
            this.selectedSubject = this.subjects[0].name;
            this.updateCurrentChapters();

            if (chapterId) {
              this.autoExpandAndLaunch(chapterId, action);
            }
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load assessment:', err);
      }
    });
  }

  private autoExpandAndLaunch(chapterId: number, action: string | null): void {
    // Find the chapter and its subject
    let foundSubject = '';
    let foundChapter: Chapter | null = null;

    for (const subject of this.subjects) {
      for (const unit of subject.units) {
        const ch = unit.chapters.find(c => c.id === chapterId);
        if (ch) {
          foundSubject = subject.name;
          foundChapter = ch;
          break;
        }
      }
      if (foundChapter) break;
    }

    if (foundChapter) {
      // Select the correct subject
      this.selectedSubject = foundSubject;
      this.updateCurrentChapters();

      // Expand the chapter
      foundChapter.isExpanded = true;

      // Auto-launch based on action
      if (action === 'lesson') {
        setTimeout(() => {
          this.startLesson(foundChapter!, new Event('click'));
        }, 500);
      } else if (action === 'test') {
        setTimeout(() => {
          this.launchExam(foundChapter!, new Event('click'));
        }, 500);
      }

      this.cdr.detectChanges();
    }
  }

  updateCurrentChapters(): void {
    const subject = this.subjects.find(s => s.name === this.selectedSubject);
    this.currentChapters = subject ? subject.units.flatMap(unit => unit.chapters) : [];
    this.cdr.detectChanges();
  }

  selectSubject(name: string): void {
    if (this.isExamActive) return;
    this.selectedSubject = name;
    this.updateCurrentChapters();
    this.cdr.detectChanges();
  }

  toggleChapter(chapter: Chapter): void {
    if (this.isExamActive) return;
    if (!chapter.unlocked) return;
    chapter.isExpanded = !chapter.isExpanded;
    this.cdr.detectChanges();
  }

  launchExam(chapter: Chapter, event: Event): void {
    event.stopPropagation();
    if (!chapter.unlocked || this.isExamActive) return;
    this.pendingLaunchChapter = chapter;
    this.isconformationpopup = true;
    this.cdr.detectChanges();
  }

  handleConfirm(): void {
    if (!this.pendingLaunchChapter) {
      this.handleCancel();
      return;
    }

    const targetChapter = this.pendingLaunchChapter;
    const chapterTestId = targetChapter.id;

    this.isconformationpopup = false;
    this.pendingLaunchChapter = null;

    const studentId = this.storage.get<number>('userId') || 1;
    const body = {
      studentId: studentId,
      assessmentType: 'CHAPTER',
      referenceId: chapterTestId,
      ipAddress: '',
      browserInfo: navigator.userAgent,
    };

    this.testService.startTest(body).subscribe({
      next: (res: any) => {
        if (res && res.success && res.data) {
          const data = res.data;
          this.activeExamChapter = {
            success: true,
            data: {
              sessionId: data.assessmentId,
              sessionCode: data.paperCode,
              testName: targetChapter.name,
              sessionToken: data.sessionToken,
              startTime: data.startTime,
              expiresAt: data.expiresAt,
              questions: (data.questions || []).map((q: any) => ({
                questionId: q.questionId,
                questionText: q.questionHtml || q.questionText,
                options: (q.options || []).map((o: any) => ({
                  optionId: o.id,
                  optionLabel: o.optionLabel,
                  optionText: o.optionHtml || o.optionText,
                })),
              })),
            }
          };
          this.isExamActive = true;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error starting exam:', err);
      }
    });
  }

  handleCancel(): void {
    if (this.isDirectMode) {
      this.router.navigate(['../', 'dashboard'], { relativeTo: this.route });
      return;
    }
    this.isconformationpopup = false;
    this.pendingLaunchChapter = null;
    this.cdr.detectChanges();
  }

  private completeAndGoBack(score?: number): void {
    if (this.directTaskId) {
      this.dashService.completeTask(this.directTaskId, {
        accuracy: score ?? 0,
        score: score ?? 0,
        studyMinutes: 0,
        metadata: ''
      }).subscribe((res) => {
        const state = res?.data?.todayTasks ? { todayTasks: res.data.todayTasks } : {};
        this.router.navigate(['../', 'dashboard'], { relativeTo: this.route, state });
      });
    } else {
      this.router.navigate(['../', 'dashboard'], { relativeTo: this.route });
    }
  }

  onExamFinished(scorePercentage: number): void {
    if (this.isDirectMode) {
      this.completeAndGoBack(scorePercentage);
      return;
    }
    this.activeExamChapter = null;
    this.isExamActive = false;
    this.loadAssessment();
    this.cdr.detectChanges();
  }

  handleTestCancel(): void {
    if (this.isDirectMode) {
      this.completeAndGoBack();
      return;
    }
    this.isExamActive = false;
    this.activeExamChapter = null;
    this.cdr.detectChanges();
  }

  // ── Lesson Player Methods ──
  startLesson(chapter: Chapter, event: Event): void {
    event.stopPropagation();
    this.lessonChapterName = chapter.name;
    this.lessonTopicName = chapter.name;
    this.lessonTopicId = chapter.id;
    this.showLessonPlayer = true;
    this.cdr.detectChanges();
  }

  onLessonClose(): void {
    if (this.isDirectMode) {
      this.completeAndGoBack();
      return;
    }
    this.showLessonPlayer = false;
    this.cdr.detectChanges();
  }

  onLessonStartTest(topicId: number): void {
    this.showLessonPlayer = false;
    // Find the chapter that contains this topic and launch its test
    const chapter = this.currentChapters.find(ch => ch.id === topicId) || this.currentChapters[0];
    if (chapter) {
      this.launchExam(chapter, new Event('click'));
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return '#22c55e';
    if (progress >= 40) return '#f59e0b';
    return '#3b82f6';
  }

  getSubjectIcon(name: string): string {
    const icons: Record<string, string> = {
      'Physics': 'fas fa-atom',
      'Chemistry': 'fas fa-flask',
      'Biology': 'fas fa-seedling',
      'Mathematics': 'fas fa-calculator',
      'General Studies': 'fas fa-globe',
      'English': 'fas fa-language',
      'Reasoning': 'fas fa-brain',
    };
    return icons[name] || 'fas fa-book';
  }

  getSubjectColor(name: string): string {
    const colors: Record<string, string> = {
      'Physics': '#4f46e5',
      'Chemistry': '#0891b2',
      'Biology': '#16a34a',
      'Mathematics': '#f59e0b',
      'General Studies': '#8b5cf6',
      'English': '#ec4899',
      'Reasoning': '#ef4444',
    };
    return colors[name] || '#64748b';
  }
}
