import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-faculty-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-management.component.html',
  styleUrl: './faculty-management.component.scss',
})
export class AdminFacultyManagementComponent {
  facultyList = signal([
    { id: '1', name: 'Dr. Rajesh Kumar', email: 'rajesh@prepexam.com', department: 'Physics', status: 'active', questionsCreated: 156, joinDate: '2024-01-15' },
    { id: '2', name: 'Prof. Sunita Sharma', email: 'sunita@prepexam.com', department: 'Chemistry', status: 'active', questionsCreated: 203, joinDate: '2024-02-20' },
    { id: '3', name: 'Dr. Amit Patel', email: 'amit@prepexam.com', department: 'Biology', status: 'active', questionsCreated: 178, joinDate: '2024-03-10' },
    { id: '4', name: 'Prof. Priya Singh', email: 'priya@prepexam.com', department: 'Mathematics', status: 'inactive', questionsCreated: 89, joinDate: '2024-06-01' },
  ]);

  searchTerm = signal('');

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  get filteredFaculty() {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.facultyList();
    return this.facultyList().filter(f => f.name.toLowerCase().includes(term) || f.department.toLowerCase().includes(term));
  }

  toggleStatus(id: string): void {
    this.facultyList.update(list => list.map(f =>
      f.id === id ? { ...f, status: f.status === 'active' ? 'inactive' : 'active' } : f
    ));
  }

  deleteFaculty(id: string): void {
    this.facultyList.update(list => list.filter(f => f.id !== id));
  }
}
