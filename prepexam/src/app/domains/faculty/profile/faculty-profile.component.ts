import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faculty-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-profile.component.html',
  styleUrl: './faculty-profile.component.scss',
})
export class FacultyProfileComponent {
  profile = signal({
    fullName: 'Dr. Faculty Member',
    email: 'faculty@prepexam.com',
    phone: '+91 98765 43210',
    department: 'Physics',
    specialization: ['Mechanics', 'Thermodynamics', 'Optics'],
    joinDate: '2024-01-15',
  });

  stats = signal({
    questionsCreated: 245,
    mocksCreated: 12,
    studentsReached: 1580,
    averageStudentScore: 72,
  });

  isEditing = signal(false);

  toggleEdit(): void {
    this.isEditing.update(v => !v);
  }

  saveProfile(): void {
    this.isEditing.set(false);
  }
}
