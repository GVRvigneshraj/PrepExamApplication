import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-assessment',
  imports: [CommonModule],
  templateUrl: './assessment.html',
  styleUrl: './assessment.scss',
})
export class Assessment {

  showDetail = false;

  selectedSubject = 'Physics';

  selectedChapter: any = null;

  ringRadius = 20;

  ringCircumference = 2 * Math.PI * 20;

  toasts: { message: string; hiding: boolean }[] = [];

  subjects = [
    { name: 'Physics', icon: 'fas fa-atom', color: '#6d4cff' },
    { name: 'Chemistry', icon: 'fas fa-flask', color: '#0097a7' },
    { name: 'Mathematics', icon: 'fas fa-square-root-variable', color: '#43a047' },
    { name: 'Biology', icon: 'fas fa-dna', color: '#ef6c00' },
    { name: 'English', icon: 'fas fa-book-open', color: '#e91e63' }
  ];

  chapters = [
    { id: 1,  name: 'Units and Measurements',          progress: 90, lessons: 5, questions: 120 },
    { id: 2,  name: 'Motion in a Straight Line',       progress: 80, lessons: 6, questions: 140 },
    { id: 3,  name: 'Motion in a Plane',               progress: 65, lessons: 6, questions: 150 },
    { id: 4,  name: 'Laws of Motion',                  progress: 45, lessons: 7, questions: 160 },
    { id: 5,  name: 'Work, Energy and Power',          progress: 30, lessons: 5, questions: 130 },
    { id: 6,  name: 'System of Particles',             progress: 20, lessons: 6, questions: 145 },
    { id: 7,  name: 'Gravitation',                     progress: 55, lessons: 5, questions: 125 },
    { id: 8,  name: 'Mechanical Properties of Solids', progress: 10, lessons: 4, questions: 100 },
    { id: 9,  name: 'Mechanical Properties of Fluids', progress: 0,  lessons: 5, questions: 110 },
    { id: 10, name: 'Thermal Properties of Matter',    progress: 40, lessons: 6, questions: 135 },
    { id: 11, name: 'Thermodynamics',                  progress: 35, lessons: 5, questions: 120 },
    { id: 12, name: 'Kinetic Theory',                  progress: 15, lessons: 4, questions: 95  },
    { id: 13, name: 'Oscillations',                    progress: 25, lessons: 5, questions: 115 },
    { id: 14, name: 'Waves',                           progress: 50, lessons: 6, questions: 140 },
    { id: 15, name: 'Electric Charges and Fields',     progress: 60, lessons: 5, questions: 130 },
    { id: 16, name: 'Electrostatic Potential',         progress: 70, lessons: 6, questions: 150 },
    { id: 17, name: 'Current Electricity',             progress: 75, lessons: 5, questions: 125 },
    { id: 18, name: 'Moving Charges and Magnetism',    progress: 0,  lessons: 6, questions: 140 }
  ];

  lessonData: { [key: string]: { name: string; completed: boolean }[] } = {
    'Motion in a Plane': [
      { name: 'Vectors and Scalars',      completed: true  },
      { name: 'Vector Addition',          completed: false },
      { name: 'Resolution of Vectors',    completed: false },
      { name: 'Motion in a Plane',        completed: false },
      { name: 'Projectile Motion',        completed: false },
      { name: 'Relative Motion',          completed: false }
    ],
    'Motion in a Straight Line': [
      { name: 'Introduction to Motion',           completed: true  },
      { name: 'Position, Path Length & Displacement', completed: true },
      { name: 'Average Velocity & Speed',         completed: true  },
      { name: 'Instantaneous Velocity & Speed',   completed: true  },
      { name: 'Acceleration',                      completed: true  },
      { name: 'Kinematic Equations',               completed: false }
    ],
    'Laws of Motion': [
      { name: 'Introduction',              completed: true  },
      { name: 'Inertia & Mass',            completed: true  },
      { name: 'Newton\'s First Law',       completed: true  },
      { name: 'Newton\'s Second Law',      completed: false },
      { name: 'Newton\'s Third Law',       completed: false },
      { name: 'Conservation of Momentum',  completed: false },
      { name: 'Friction',                  completed: false }
    ]
  };

  descriptions: { [key: string]: string } = {
    'Motion in a Plane':
      'Understand the concepts of vectors, scalars, and their applications in two-dimensional motion. Learn about projectile motion, relative velocity, and circular motion fundamentals.',
    'Motion in a Straight Line':
      'Explore rectilinear motion including displacement, velocity, acceleration, and kinematic equations for uniformly accelerated motion.',
    'Laws of Motion':
      'Dive into Newton\'s three laws of motion, conservation of momentum, friction, and their real-world applications in problem solving.'
  };

  getChapterLessons(chapter: any): { name: string; completed: boolean }[] {

    if (this.lessonData[chapter.name]) {
      return this.lessonData[chapter.name];
    }

    const lessons = [];
    const completedCount = Math.floor(chapter.lessons * chapter.progress / 100);

    for (let i = 1; i <= chapter.lessons; i++) {
      lessons.push({
        name: 'Lesson ' + i,
        completed: i <= completedCount
      });
    }

    return lessons;

  }

  getChapterDescription(chapter: any): string {

    if (this.descriptions[chapter.name]) {
      return this.descriptions[chapter.name];
    }

    return 'Master the fundamental concepts of ' + chapter.name + '. Work through structured lessons designed to build deep understanding and problem-solving skills.';

  }

  getProgressColor(progress: number): string {

    if (progress >= 70) return '#22c55e';
    if (progress >= 40) return '#f59e0b';
    if (progress >= 1)  return '#f97316';
    return '#cbd5e1';

  }

  getProgressOffset(progress: number): number {

    return this.ringCircumference - (this.ringCircumference * progress / 100);

  }

  selectSubject(name: string) {

    this.selectedSubject = name;
    this.showToast(name + ' selected');

  }

  openChapter(chapter: any) {

    this.selectedChapter = chapter;
    this.showDetail = true;

  }

  goBack() {

    this.showDetail = false;
    this.selectedChapter = null;

  }

  startLesson(lessonName: string) {

    this.showToast('Starting: ' + lessonName);

  }

  startChapterTest() {

    if (this.selectedChapter) {
      this.showToast('Starting test: ' + this.selectedChapter.name);
    }

  }

  showToast(message: string) {

    this.toasts.push({ message, hiding: false });

    setTimeout(() => {

      if (this.toasts.length > 0) {

        this.toasts[0].hiding = true;

        setTimeout(() => {
          this.toasts.shift();
        }, 400);

      }

    }, 2500);

  }

}
