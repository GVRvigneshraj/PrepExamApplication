import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HistoryService } from '../../../core/services/history.service';
import { HistoryItem } from '../../../core/models/history.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {

  constructor(
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ── State ──
  activeTab = signal<'assessment' | 'mcq' | 'mock' | 'pyq'>('assessment');
  historyItems = signal<HistoryItem[]>([]);
  isLoading = signal(false);
  isLoadingMore = signal(false);
  currentPage = signal(0);
  hasMore = signal(true);
  selectedSubject = signal<string>('all');
  sortBy = signal<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  searchText = signal('');
  selectedDetail = signal<HistoryItem | null>(null);

  subjects = ['all', 'Physics', 'Chemistry', 'Biology'];
  sortOptions: { value: string; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Score' },
    { value: 'lowest', label: 'Lowest Score' },
  ];

  // ── Lifecycle ──
  ngOnInit(): void {
    this.loadHistory();
  }

  // ── Tab Switch ──
  switchTab(tab: 'assessment' | 'mcq' | 'mock' | 'pyq'): void {
    this.activeTab.set(tab);
    this.currentPage.set(0);
    this.hasMore.set(true);
    this.historyItems.set([]);
    this.loadHistory();
  }

  // ── Load Data ──
  loadHistory(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const page = this.currentPage();
    let request: Observable<any>;

    switch (this.activeTab()) {
      case 'assessment': request = this.historyService.getAssessmentHistory(page); break;
      case 'mcq': request = this.historyService.getMcqHistory(page); break;
      case 'mock': request = this.historyService.getMockHistory(page); break;
      case 'pyq': request = this.historyService.getPyqHistory(page); break;
    }

    request.subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res && res.success && res.data) {
          const items = Array.isArray(res.data) ? res.data : (res.data.content || []);
          if (page === 0) {
            this.historyItems.set(items);
          } else {
            this.historyItems.update(list => [...list, ...items]);
          }
          this.hasMore.set(items.length >= 20);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  loadMore(): void {
    if (this.isLoadingMore() || !this.hasMore()) return;
    this.isLoadingMore.set(true);
    this.currentPage.update(p => p + 1);

    const page = this.currentPage();
    let request: Observable<any>;

    switch (this.activeTab()) {
      case 'assessment': request = this.historyService.getAssessmentHistory(page); break;
      case 'mcq': request = this.historyService.getMcqHistory(page); break;
      case 'mock': request = this.historyService.getMockHistory(page); break;
      case 'pyq': request = this.historyService.getPyqHistory(page); break;
    }

    request.subscribe({
      next: (res: any) => {
        this.isLoadingMore.set(false);
        if (res && res.success && res.data) {
          const items = Array.isArray(res.data) ? res.data : (res.data.content || []);
          this.historyItems.update(list => [...list, ...items]);
          this.hasMore.set(items.length >= 20);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingMore.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  // ── Filters ──
  onSearch(): void {
    this.currentPage.set(0);
    this.historyItems.set([]);
    this.loadHistory();
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.historyItems.set([]);
    this.loadHistory();
  }

  // ── Detail ──
  openDetail(item: HistoryItem): void {
    this.selectedDetail.set(item);
  }

  closeDetail(): void {
    this.selectedDetail.set(null);
  }

  // ── Helpers ──
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return '#22c55e';
      case 'IN_PROGRESS': return '#f59e0b';
      default: return '#94a3b8';
    }
  }

  getDifficultyColor(d: string): string {
    switch (d?.toUpperCase()) {
      case 'EASY': return '#22c55e';
      case 'MEDIUM': return '#f59e0b';
      case 'HARD': return '#ef4444';
      default: return '#94a3b8';
    }
  }

  getSubjectColor(s: string): string {
    switch (s) {
      case 'Physics': return '#4f46e5';
      case 'Chemistry': return '#0891b2';
      case 'Biology': return '#16a34a';
      default: return '#64748b';
    }
  }

  getTestTypeLabel(type: string): string {
    switch (type) {
      case 'ASSESSMENT': return 'Assessment';
      case 'MCQ': return 'MCQ Practice';
      case 'MOCK_SERIES': return 'Mock Series';
      case 'PYQ': return 'PYQ Paper';
      default: return type;
    }
  }

  getTestTypeIcon(type: string): string {
    switch (type) {
      case 'ASSESSMENT': return 'fas fa-clipboard-check';
      case 'MCQ': return 'fas fa-question-circle';
      case 'MOCK_SERIES': return 'fas fa-layer-group';
      case 'PYQ': return 'fas fa-history';
      default: return 'fas fa-file-alt';
    }
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 200) {
      this.loadMore();
    }
  }

  trackByFn(index: number, item: HistoryItem): number {
    return item.id;
  }
}
