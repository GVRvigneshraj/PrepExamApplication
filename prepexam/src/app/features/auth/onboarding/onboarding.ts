import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  imports: [CommonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding  {

  private router = inject(Router);

  currentSlide = 0;

  slides = [
    {
      title: 'Choose Your Exam',
      subtitle: 'Select from 200+ competitive exams.'
    },
    {
      title: 'Practice Daily',
      subtitle: 'AI generated mock tests.'
    },
    {
      title: 'Track Progress',
      subtitle: 'Detailed analytics and reports.'
    }
  ];

  next(): void {

    if (this.currentSlide < this.slides.length - 1) {

      this.currentSlide++;

    } else {

      // Save onboarding completed
      localStorage.setItem('onboardingCompleted', 'true');

      // Demo selected exam
      localStorage.setItem('selectedExam', 'neet');

      // Navigate Dashboard
      this.router.navigate(['/neet/dashboard']);

    }

  }

  skip(): void {

    localStorage.setItem('onboardingCompleted', 'true');

    localStorage.setItem('selectedExam', 'neet');

    this.router.navigate(['/neet/dashboard']);

  }

}
