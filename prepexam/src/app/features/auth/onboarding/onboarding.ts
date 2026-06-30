import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChatBubble {
  text: string;
  displayedText: string;
  isFullyTyped: boolean;
}

interface QuizQuestion {
  id: number;
  subject: string;
  text: string;
  options: { key: string; value: string }[];
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding implements OnInit {
  currentStep: 'welcome' | 'step1' | 'step2' | 'assessment' | 'analysis' = 'welcome';
  isCreatingDashboard = false;

  welcomeMessages: string[] = [
    "Hello there! Welcome to PrepExam, your AI-powered study companion. I'm here to help you crack your dream exam.",
    "I'll analyze your current level, create a personalized study plan, and guide you every step of the way. Let's make your preparation smart and effective!",
    "Shall we begin setting up your preparation journey?"
  ];

  analysisMessages: string[] = [
    "I've analyzed your assessment. You scored 6 out of 10, placing you at the \"Intermediate\" level.",
    "Subject-wise breakdown:\nPhysics: 33%\nChemistry: 67%\nBiology: 50%\nZoology: 100%",
    "Strongest: Zoology (100%). Focus more on Physics (33%) for balanced prep.",
    "I've created a personalized daily plan with MCQ practice, PYQ sessions, and chapter-wise lessons. Let's go!"
  ];

  questions: QuizQuestion[] = [
    { id: 1, subject: 'PHYSICS', text: 'A body of mass 2 kg is thrown upward with a velocity of 20 m/s. The kinetic energy at the highest point is:', options: [{key:'A', value:'400 J'}, {key:'B', value:'200 J'}, {key:'C', value:'0 J'}, {key:'D', value:'100 J'}] },
    { id: 2, subject: 'PHYSICS', text: 'What is the dimensional formula for universal gravitational constant (G)?', options: [{key:'A', value:'[M⁻¹L³T⁻²]'}, {key:'B', value:'[ML³T⁻²]'}, {key:'C', value:'[M⁻¹L²T⁻¹]'}, {key:'D', value:'[M¹L³T⁻²]'}] },
    { id: 3, subject: 'CHEMISTRY', text: 'Which of the following has the highest electronegativity?', options: [{key:'A', value:'Fluorine'}, {key:'B', value:'Chlorine'}, {key:'C', value:'Oxygen'}, {key:'D', value:'Nitrogen'}] },
    { id: 4, subject: 'CHEMISTRY', text: 'The bond angle in water molecule is approximately:', options: [{key:'A', value:'120°'}, {key:'B', value:'109.5°'}, {key:'C', value:'104.5°'}, {key:'D', value:'90°'}] },
    { id: 5, subject: 'BIOLOGY', text: 'Which organelle is known as the powerhouse of the cell?', options: [{key:'A', value:'Nucleus'}, {key:'B', value:'Mitochondria'}, {key:'C', value:'Ribosome'}, {key:'D', value:'Golgi Body'}] },
    { id: 6, subject: 'BIOLOGY', text: 'Who proposed the fluid mosaic model of plasma membrane?', options: [{key:'A', value:'Singer and Nicolson'}, {key:'B', value:'Watson and Crick'}, {key:'C', value:'Robert Brown'}, {key:'D', value:'Camillo Golgi'}] },
    { id: 7, subject: 'ZOOLOGY', text: 'Which of the following is a warm-blooded animal?', options: [{key:'A', value:'Pigeon'}, {key:'B', value:'Crocodile'}, {key:'C', value:'Frog'}, {key:'D', value:'Shark'}] },
    { id: 8, subject: 'ZOOLOGY', text: 'The functional unit of human kidney is called:', options: [{key:'A', value:'Neuron'}, {key:'B', value:'Nephron'}, {key:'C', value:'Alveoli'}, {key:'D', value:'Lumen'}] },
    { id: 9, subject: 'BIOLOGY', text: 'Which hormone is primarily responsible for fruit ripening?', options: [{key:'A', value:'Auxin'}, {key:'B', value:'Ethylene'}, {key:'C', value:'Cytokinin'}, {key:'D', value:'Gibberellin'}] },
    { id: 10, subject: 'PHYSICS', text: 'The work done by a conservative force along a closed path loop is always:', options: [{key:'A', value:'Positive'}, {key:'B', value:'Negative'}, {key:'C', value:'Zero'}, {key:'D', value:'Infinite'}] }
  ];

  activeBubbles: ChatBubble[] = [];
  isTypingComplete = false;

  selectedExam: 'NEET' | 'JEE' | null = null;
  selectedTarget: string | null = null;

  currentQuestionIndex = 0;
  userAnswers: { [key: number]: string } = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => { this.startChatFlow(this.welcomeMessages); }, 50);
  }

  async startChatFlow(messages: string[]) {
    this.activeBubbles = [];
    this.isTypingComplete = false;
    this.cdr.detectChanges();

    for (let i = 0; i < messages.length; i++) {
      const bubble: ChatBubble = { text: messages[i], displayedText: '', isFullyTyped: false };
      this.activeBubbles.push(bubble);
      this.cdr.detectChanges();
      await this.typeText(bubble);
    }
    this.isTypingComplete = true;
    this.cdr.detectChanges();
  }

  typeText(bubble: ChatBubble): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < bubble.text.length) {
          bubble.displayedText += bubble.text.charAt(index);
          index++;
          this.cdr.detectChanges();
        } else {
          clearInterval(interval);
          bubble.isFullyTyped = true;
          this.cdr.detectChanges();
          setTimeout(() => resolve(), 150);
        }
      }, 10);
    });
  }

  goToStep1() { this.currentStep = 'step1'; }
  selectExam(exam: 'NEET' | 'JEE') { this.selectedExam = exam; }
  goToStep2() { if (this.selectedExam) this.currentStep = 'step2'; }
  goBackToStep1() { this.currentStep = 'step1'; }
  startAssessment() { if (this.selectedTarget) this.currentStep = 'assessment'; }

  selectAnswer(ans: string) {
    this.userAnswers[this.currentQuestionIndex] = ans;
  }

  get currentSelectedAnswer(): string | null {
    return this.userAnswers[this.currentQuestionIndex] || null;
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else {
      this.currentStep = 'step2';
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.currentStep = 'analysis';
      setTimeout(() => { this.startChatFlow(this.analysisMessages); }, 50);
    }
  }

  buildDashboardAndRedirect() {
    this.isCreatingDashboard = true;
    setTimeout(() => {
      this.isCreatingDashboard = false;
      window.location.href = '/neet/dashboard';
    }, 3000);
  }
}
