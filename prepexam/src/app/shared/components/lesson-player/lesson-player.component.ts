import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LessonTopic {
  topicId: number;
  topicName: string;
  questionCount: number;
  locked: boolean;
}

export interface LessonChapter {
  chapterId: number;
  chapterName: string;
  topics: LessonTopic[];
}

export interface Scene {
  key: string;
  tag: string;
  title: string;
  duration: number;
  narration: string;
  draw: string;
  quiz: { q: string; options: string[]; correct: number } | null;
}

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lesson-app">
      <!-- Top Bar -->
      <div class="topbar">
        <div class="brand">
          <button class="back-btn" (click)="exitLesson()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="brand-mark"><i class="fas fa-atom"></i></div>
          <div>
            <div class="brand-name">{{ chapterName }}</div>
            <div class="brand-sub">{{ topicName }} · Scene {{ sceneIndex + 1 }} of {{ scenes.length }}</div>
          </div>
        </div>
      </div>

      <!-- Progress Row -->
      <div class="progress-row">
        <div class="progress-seg" *ngFor="let s of scenes; let i = index"
          [class.done]="sceneDone[i]"
          [class.active]="i === sceneIndex && !sceneDone[i]">
          <div class="fill" [style.width]="i === sceneIndex && !sceneDone[i] ? getSceneProgress() + '%' : (sceneDone[i] ? '100%' : '0%')"></div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid">
        <!-- Stage -->
        <div class="stage">
          <div class="stage-head">
            <div>
              <div class="scene-tag">{{ currentScene?.tag }}</div>
              <div class="scene-title">{{ currentScene?.title }}</div>
            </div>
            <div class="timer mono">{{ formatTime(getRemainingTime()) }}</div>
          </div>

          <canvas #stageCanvas width="1000" height="290"></canvas>

          <div class="caption-box">
            <span class="speaking-dot" *ngIf="isSpeaking"></span>
            <span>{{ currentCaption }}</span>
          </div>

          <div class="controls">
            <button class="btn btn-primary" (click)="togglePlay()" [disabled]="sceneDone[sceneIndex] && !isPlaying">
              {{ isPlaying ? '⏸ Pause' : '▶ Play' }}
            </button>
            <button class="btn btn-ghost" (click)="replayScene()">⟲ Replay</button>
            <button class="btn btn-ghost" [class.btn-primary]="sceneDone[sceneIndex] && sceneIndex < scenes.length - 1"
              (click)="nextScene()" [disabled]="!sceneDone[sceneIndex] || sceneIndex >= scenes.length - 1">
              Next ⟳
            </button>
            <div class="spacer"></div>
            <button class="btn btn-doubt" (click)="openDoubt()">🖐 I don't understand</button>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="sidebar">
          <div class="card">
            <h3>Lesson Map</h3>
            <div class="concept-item" *ngFor="let s of scenes; let i = index"
              [class.done]="sceneDone[i]" [class.current]="i === sceneIndex">
              <div class="concept-dot">{{ sceneDone[i] ? '✓' : (i + 1) }}</div>
              <div class="concept-name">{{ s.title }}</div>
            </div>
          </div>
          <div class="card">
            <h3>Live Understanding</h3>
            <div class="stat-row"><span>Concepts cleared</span><b>{{ getSceneDoneCount() }} / {{ scenes.length }}</b></div>
            <div class="stat-row"><span>Doubts asked</span><b>{{ doubtsAsked }}</b></div>
            <div class="stat-row"><span>Quiz accuracy</span><b>{{ getQuizAccuracy() }}</b></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Overlay -->
    <div class="overlay" *ngIf="showQuiz">
      <div class="modal">
        <div class="modal-eyebrow">Quick check</div>
        <h2>{{ currentQuiz?.q }}</h2>
        <div>
          <button class="quiz-opt" *ngFor="let opt of currentQuiz?.options; let i = index"
            [class.correct]="quizAnswered && i === currentQuiz?.correct"
            [class.wrong]="quizAnswered && i === selectedQuizOption && i !== currentQuiz?.correct"
            [disabled]="quizAnswered"
            (click)="answerQuiz(i)">
            {{ opt }}
          </button>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" [disabled]="!quizAnswered" (click)="closeQuiz()">Continue</button>
        </div>
      </div>
    </div>

    <!-- Doubt Overlay -->
    <div class="overlay" *ngIf="showDoubt">
      <div class="modal">
        <div class="modal-eyebrow">Lesson paused · Ask the AI teacher</div>
        <h2>About: {{ currentScene?.title }}</h2>
        <textarea placeholder="Type what's confusing you..." [(ngModel)]="doubtText"></textarea>
        <div class="modal-actions">
          <button class="btn btn-ghost" (click)="closeDoubt()">Cancel</button>
          <button class="btn btn-primary" (click)="sendDoubt()">Ask</button>
        </div>
        <div *ngIf="doubtResponse" class="ai-response" [innerHTML]="doubtResponse"></div>
      </div>
    </div>

    <!-- Summary Overlay -->
    <div class="overlay" *ngIf="showSummary">
      <div class="modal">
        <div class="modal-eyebrow">Lesson complete</div>
        <h2>{{ topicName }}</h2>
        <div class="summary-score">{{ getQuizAccuracy() }}</div>
        <div style="color:var(--ink-dim);font-size:13px;margin-bottom:10px;">Final quiz accuracy</div>
        <div class="modal-actions">
          <button class="btn btn-ghost" (click)="closeSummary()">Close</button>
          <button class="btn btn-primary" (click)="startTopicTest()">Start Topic Test <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './lesson-player.component.scss'
})
export class LessonPlayerComponent implements OnInit, OnDestroy {
  @Input() chapterName = '';
  @Input() topicName = '';
  @Input() topicId = 0;
  @Output() close = new EventEmitter<void>();
  @Output() startTest = new EventEmitter<number>();
  @ViewChild('stageCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  scenes: Scene[] = [];
  sceneIndex = 0;
  sceneDone: boolean[] = [];
  isPlaying = false;
  isSpeaking = false;
  currentCaption = 'Press play to start the lesson.';
  showQuiz = false;
  currentQuiz: { q: string; options: string[]; correct: number } | null = null;
  quizAnswered = false;
  selectedQuizOption = -1;
  showDoubt = false;
  doubtText = '';
  doubtResponse = '';
  showSummary = false;
  doubtsAsked = 0;
  quizResults: boolean[] = [];
  sceneElapsed = 0;
  private sceneTimer: any = null;
  private animFrame: any = null;
  private ctx!: CanvasRenderingContext2D;
  private ballX = 80;
  private ballVel = 0;
  private pushed = false;

  ngOnInit(): void {
    this.generateScenes();
    this.sceneDone = new Array(this.scenes.length).fill(false);
    this.loadScene(0);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  generateScenes(): void {
    this.scenes = [
      {
        key: 'intro', tag: 'SCENE 1 · INTRODUCTION',
        title: `What is ${this.topicName}?`,
        duration: 20,
        narration: `Let's explore ${this.topicName}. This is a fundamental concept in ${this.chapterName}. Pay attention to the key ideas as we walk through each part.`,
        draw: 'intro', quiz: null
      },
      {
        key: 'concept', tag: 'SCENE 2 · CORE CONCEPT',
        title: `Understanding ${this.topicName}`,
        duration: 25,
        narration: `Now let's understand the core concept. ${this.topicName} is a key topic in ${this.chapterName}. Remember the key principles we're about to cover.`,
        draw: 'concept', quiz: {
          q: `What is the main idea behind ${this.topicName}?`,
          options: ['It only applies to stationary objects', 'It describes a fundamental relationship in physics', 'It only works in实验室', 'It is outdated science'],
          correct: 1
        }
      },
      {
        key: 'example', tag: 'SCENE 3 · REAL-LIFE EXAMPLE',
        title: `Everyday applications`,
        duration: 22,
        narration: `You see this concept in everyday life. From sports to vehicles to simple household items — ${this.topicName} is everywhere. Let's look at a concrete example.`,
        draw: 'example', quiz: {
          q: 'Which everyday situation demonstrates this concept?',
          options: ['A ball rolling on a frictionless surface', 'A car braking at a red light', 'Both of the above', 'None of the above'],
          correct: 2
        }
      },
      {
        key: 'practice', tag: 'SCENE 4 · INTERACTIVE',
        title: 'Try it yourself',
        duration: 20,
        narration: `Now let's apply what you've learned. Think about how ${this.topicName} applies to the scenario shown on screen.`,
        draw: 'practice', quiz: {
          q: `Apply ${this.topicName} to this scenario. What happens?`,
          options: ['Nothing changes', 'The system reaches equilibrium', 'It explodes', 'Gravity reverses'],
          correct: 1
        }
      },
      {
        key: 'summary', tag: 'SCENE 5 · SUMMARY',
        title: 'Putting it all together',
        duration: 18,
        narration: `Great work! Let's recap: ${this.topicName} is a core concept in ${this.chapterName}. You've learned the definition, seen real-world examples, and practiced applying it.`,
        draw: 'recap', quiz: null
      }
    ];
  }

  get currentScene(): Scene | null {
    return this.scenes[this.sceneIndex] || null;
  }

  loadScene(index: number, autoplay = false): void {
    this.cleanup();
    this.sceneIndex = index;
    this.sceneElapsed = 0;
    this.pushed = false;
    this.ballVel = 0;
    this.ballX = 80;
    this.currentCaption = this.scenes[index].narration;
    this.drawScene(this.scenes[index].draw, 0);
    if (autoplay) this.play();
  }

  play(): void {
    if (this.sceneDone[this.sceneIndex]) return;
    this.isPlaying = true;
    this.speak(this.scenes[this.sceneIndex].narration);
    this.startAnimation();
    this.sceneTimer = setInterval(() => {
      this.sceneElapsed += 0.2;
      if (this.sceneElapsed >= this.scenes[this.sceneIndex].duration) {
        clearInterval(this.sceneTimer);
        this.onSceneComplete();
      }
    }, 200);
  }

  pause(): void {
    this.isPlaying = false;
    window.speechSynthesis.pause();
    cancelAnimationFrame(this.animFrame);
    clearInterval(this.sceneTimer);
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.sceneElapsed > 0 && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.isPlaying = true;
        this.startAnimation();
        this.sceneTimer = setInterval(() => {
          this.sceneElapsed += 0.2;
          if (this.sceneElapsed >= this.scenes[this.sceneIndex].duration) {
            clearInterval(this.sceneTimer);
            this.onSceneComplete();
          }
        }, 200);
      } else {
        this.play();
      }
    }
  }

  replayScene(): void {
    this.sceneDone[this.sceneIndex] = false;
    this.loadScene(this.sceneIndex, true);
  }

  nextScene(): void {
    if (this.sceneIndex < this.scenes.length - 1) {
      this.loadScene(this.sceneIndex + 1);
    }
  }

  onSceneComplete(): void {
    this.isPlaying = false;
    cancelAnimationFrame(this.animFrame);
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    const scene = this.scenes[this.sceneIndex];
    if (scene.quiz) {
      this.currentQuiz = scene.quiz;
      this.quizAnswered = false;
      this.selectedQuizOption = -1;
      this.showQuiz = true;
    } else {
      this.finishScene();
    }
  }

  finishScene(): void {
    this.sceneDone[this.sceneIndex] = true;
    if (this.sceneIndex === this.scenes.length - 1) {
      this.showSummary = true;
    }
  }

  answerQuiz(index: number): void {
    this.quizAnswered = true;
    this.selectedQuizOption = index;
    this.quizResults.push(index === this.currentQuiz?.correct);
  }

  closeQuiz(): void {
    this.showQuiz = false;
    this.finishScene();
  }

  openDoubt(): void {
    this.pause();
    this.doubtText = '';
    this.doubtResponse = '';
    this.showDoubt = true;
  }

  closeDoubt(): void {
    this.showDoubt = false;
  }

  sendDoubt(): void {
    this.doubtsAsked++;
    this.doubtResponse = `<b>AI Teacher:</b> Great question! Based on the concept of ${this.topicName}, let me explain... This is a fundamental principle that connects to what we just covered in the lesson. Try to think about it in terms of the real-world examples we discussed.`;
  }

  closeSummary(): void {
    this.showSummary = false;
    this.close.emit();
  }

  startTopicTest(): void {
    this.showSummary = false;
    this.startTest.emit(this.topicId);
  }

  exitLesson(): void {
    this.cleanup();
    this.close.emit();
  }

  // ── Canvas Drawing ──
  startAnimation(): void {
    let startTime: number | null = null;
    const loop = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;
      this.drawScene(this.scenes[this.sceneIndex].draw, t);
      if (this.isPlaying) this.animFrame = requestAnimationFrame(loop);
    };
    this.animFrame = requestAnimationFrame(loop);
  }

  drawScene(type: string, t: number): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d')!;
    const ctx = this.ctx;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Ground line
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 230);
    ctx.lineTo(w, 230);
    ctx.stroke();

    switch (type) {
      case 'intro': this.drawIntro(ctx, w, t); break;
      case 'concept': this.drawConcept(ctx, w, t); break;
      case 'example': this.drawExample(ctx, w, t); break;
      case 'practice': this.drawPractice(ctx, w, t); break;
      case 'recap': this.drawRecap(ctx, w, t); break;
    }
  }

  private drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color = '#7C6CF6'): void {
    const grad = ctx.createRadialGradient(x - r / 3, y - r / 3, 2, x, y, r);
    grad.addColorStop(0, '#B5A9FF');
    grad.addColorStop(1, color);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  private drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color = '#37D6C4'): void {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(angle - 0.4), y2 - 10 * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - 10 * Math.cos(angle + 0.4), y2 - 10 * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  private drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#8B93A7', size = 12, align: CanvasTextAlign = 'left'): void {
    ctx.fillStyle = color;
    ctx.font = `${size}px Inter, sans-serif`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  drawIntro(ctx: CanvasRenderingContext2D, w: number, t: number): void {
    this.drawBall(ctx, 500, 208, 26);
    this.drawLabel(ctx, 'v = 0', 500, 150, '#8B93A7', 13, 'center');
    this.drawLabel(ctx, `Learning: ${this.topicName}`, 500, 270, '#5C6478', 12, 'center');
  }

  drawConcept(ctx: CanvasRenderingContext2D, w: number, t: number): void {
    this.drawBall(ctx, 500, 208, 26);
    this.drawArrow(ctx, 500, 182, 500, 120, '#37D6C4');
    this.drawLabel(ctx, 'Force A', 500, 110, '#37D6C4', 11, 'center');
    this.drawArrow(ctx, 500, 234, 500, 270, '#F5A623');
    this.drawLabel(ctx, 'Force B', 500, 286, '#F5A623', 11, 'center');
    this.drawLabel(ctx, 'Balanced forces → Equilibrium', 500, 60, '#B5A9FF', 13, 'center');
  }

  drawExample(ctx: CanvasRenderingContext2D, w: number, t: number): void {
    const shake = t < 1.2 ? Math.sin(t * 40) * 3 : 0;
    ctx.fillStyle = '#2A3040';
    ctx.fillRect(220 + shake, 120, 260, 90);
    ctx.fillStyle = '#0A0E17';
    ctx.fillRect(240 + shake, 135, 60, 40);
    ctx.fillRect(310 + shake, 135, 60, 40);
    ctx.beginPath(); ctx.arc(260 + shake, 214, 16, 0, Math.PI * 2); ctx.fillStyle = '#111'; ctx.fill();
    ctx.beginPath(); ctx.arc(420 + shake, 214, 16, 0, Math.PI * 2); ctx.fill();
    const lean = Math.min(t * 22, 34);
    ctx.save();
    ctx.translate(370, 175);
    ctx.rotate(lean * Math.PI / 180 * 0.6 * -1);
    ctx.beginPath(); ctx.arc(0, -18, 10, 0, Math.PI * 2); ctx.fillStyle = '#F5A623'; ctx.fill();
    ctx.fillRect(-6, -8, 12, 26);
    ctx.restore();
    this.drawLabel(ctx, t < 1.2 ? 'Object in motion stays in motion' : 'Force required to change state', 340, 270, '#8B93A7', 12, 'center');
  }

  drawPractice(ctx: CanvasRenderingContext2D, w: number, t: number): void {
    this.ballX += this.ballVel;
    if (this.ballX > 920) { this.ballX = 920; this.ballVel = 0; }
    this.drawBall(ctx, this.ballX, 208, 24);
    this.drawLabel(ctx, `v = ${this.ballVel.toFixed(1)}`, this.ballX, 150, '#37D6C4', 12, 'center');
    if (this.pushed && this.ballVel > 0) {
      this.drawArrow(ctx, this.ballX - 40, 208, this.ballX - 8, 208, '#F5A623');
    }
    this.drawLabel(ctx, 'Watch how the object responds to applied force', 500, 270, '#5C6478', 12, 'center');
  }

  drawRecap(ctx: CanvasRenderingContext2D, w: number, t: number): void {
    this.drawBall(ctx, 200, 208, 20);
    this.drawLabel(ctx, 'Rest', 200, 270, '#8B93A7', 11, 'center');
    this.drawArrow(ctx, 360, 208, 440, 208, '#37D6C4');
    this.drawBall(ctx, 480, 208, 20);
    this.drawLabel(ctx, 'Constant v', 480, 270, '#8B93A7', 11, 'center');
    this.drawArrow(ctx, 560, 150, 560, 190, '#F5A623');
    this.drawLabel(ctx, 'Force = Δv', 640, 150, '#F5A623', 12, 'left');
    this.drawBall(ctx, 760, 208, 20, '#37D6C4');
    this.drawLabel(ctx, 'Concept Applied', 760, 270, '#8B93A7', 11, 'center');
  }

  // ── Speech ──
  speak(text: string): void {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.98;
    utter.pitch = 1.0;
    utter.onstart = () => { this.isSpeaking = true; };
    utter.onend = () => { this.isSpeaking = false; };
    window.speechSynthesis.speak(utter);
  }

  // ── Helpers ──
  getSceneProgress(): string {
    const scene = this.scenes[this.sceneIndex];
    return Math.min(100, (this.sceneElapsed / scene.duration) * 100).toString();
  }

  getRemainingTime(): number {
    const scene = this.scenes[this.sceneIndex];
    return Math.max(0, scene.duration - this.sceneElapsed);
  }

  getSceneDoneCount(): number {
    return this.sceneDone.filter(Boolean).length;
  }

  getQuizAccuracy(): string {
    if (this.quizResults.length === 0) return '—';
    const correct = this.quizResults.filter(Boolean).length;
    return Math.round((correct / this.quizResults.length) * 100) + '%';
  }

  formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  private cleanup(): void {
    clearInterval(this.sceneTimer);
    cancelAnimationFrame(this.animFrame);
    window.speechSynthesis.cancel();
  }
}
