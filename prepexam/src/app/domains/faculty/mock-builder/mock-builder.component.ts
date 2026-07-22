import { Component, signal } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/layouts/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-faculty-mock-builder',
  standalone: true,
  imports: [BreadcrumbComponent, CardComponent, ButtonComponent],
  template: `
    <app-breadcrumb [items]="breadcrumbs" />

    <div class="page-header">
      <h1>Mock Test Builder</h1>
      <app-button size="sm">+ Create Mock</app-button>
    </div>

    <div class="mock-list">
      @for (mock of mocks(); track mock.id) {
        <app-card variant="elevated">
          <div class="mock-item">
            <div class="mock-info">
              <h3>{{ mock.title }}</h3>
              <p>{{ mock.questions }} questions &middot; {{ mock.duration }} min</p>
            </div>
            <app-button variant="secondary" size="sm">Edit</app-button>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1E293B; margin: 0; }
    .mock-list { display: flex; flex-direction: column; gap: 1rem; }
    .mock-item { display: flex; align-items: center; justify-content: space-between; }
    .mock-info h3 { margin: 0; }
    .mock-info p { margin: 0.25rem 0 0; color: #64748B; font-size: 0.875rem; }
  `],
})
export class FacultyMockBuilderComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Mock Builder' }];

  mocks = signal([
    { id: '1', title: 'NEET Full Length Mock 5', questions: 200, duration: 200 },
    { id: '2', title: 'Physics Quick Test', questions: 50, duration: 60 },
  ]);
}
