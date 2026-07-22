import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-faculty-question-bank',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Question Bank</h1>
      <app-button size="sm">+ Add Question</app-button>
    </div>

    <app-card variant="elevated">
      <div class="question-list">
        @for (q of questions(); track q.id) {
          <div class="question-row">
            <div class="question-info">
              <p class="question-text">{{ q.text }}</p>
              <span class="question-meta">{{ q.subject }} &middot; {{ q.chapter }}</span>
            </div>
            <app-badge [text]="q.status" [variant]="q.status === 'Published' ? 'success' : 'warning'" />
            <app-button variant="secondary" size="sm">Edit</app-button>
          </div>
        }
      </div>
    </app-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .question-list { display: flex; flex-direction: column; }
    .question-row { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #F1F5F9; }
    .question-info { flex: 1; }
    .question-text { margin: 0; font-weight: 500; }
    .question-meta { font-size: 0.875rem; color: #64748B; }
  `],
})
export class FacultyQuestionBankComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Question Bank' }];

  questions = signal([
    { id: '1', text: 'What is Newton\'s second law of motion?', subject: 'Physics', chapter: 'Mechanics', status: 'Published' },
    { id: '2', text: 'Define entropy in thermodynamics', subject: 'Physics', chapter: 'Thermodynamics', status: 'Draft' },
    { id: '3', text: 'Explain the hybridization of methane', subject: 'Chemistry', chapter: 'Chemical Bonding', status: 'Published' },
  ]);
}
