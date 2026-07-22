import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-student-practice',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Daily Practice</h1>
      <p>Sharpen your skills with daily practice sets</p>
    </div>

    <div class="practice-grid">
      @for (topic of topics(); track topic.id) {
        <app-card variant="elevated">
          <div class="practice-item">
            <i [class]="'fas ' + topic.icon + ' topic-icon'"></i>
            <div class="practice-info">
              <h3>{{ topic.name }}</h3>
              <p>{{ topic.questionCount }} questions</p>
            </div>
            <app-button size="sm">Practice</app-button>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0 0 0.25rem; }
    .page-header p { color: #64748B; margin: 0; }
    .practice-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .practice-item { display: flex; align-items: center; gap: 1rem; }
    .topic-icon { font-size: 1.5rem; color: #6366F1; width: 2rem; text-align: center; }
    .practice-info { flex: 1; }
    .practice-info h3 { margin: 0; font-size: 1rem; font-weight: 600; }
    .practice-info p { margin: 0.25rem 0 0; font-size: 0.875rem; color: #64748B; }
  `],
})
export class StudentPracticeComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Daily Practice' }];

  topics = signal([
    { id: '1', name: 'Physics - Thermodynamics', icon: 'fa-fire', questionCount: 20 },
    { id: '2', name: 'Chemistry - Equilibrium', icon: 'fa-balance-scale', questionCount: 15 },
    { id: '3', name: 'Biology - Cell Biology', icon: 'fa-dna', questionCount: 25 },
    { id: '4', name: 'Physics - Optics', icon: 'fa-eye', questionCount: 18 },
  ]);
}
