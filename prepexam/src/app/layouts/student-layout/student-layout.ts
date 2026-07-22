import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/layouts/header/header.component';
import { SidebarComponent } from '../../shared/layouts/sidebar/sidebar.component';
import { MobileMenuComponent } from '../../shared/layouts/sidebar/mobile-menu.component';
import { STUDENT_ROUTES } from '../../core/config/route.config';
import { AuthService } from '../../core/auth/auth.service';
import { TokenService } from '../../core/auth/token.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, HeaderComponent, SidebarComponent, MobileMenuComponent],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.scss',
})
export class StudentLayout implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private refreshInterval: any;

  sidebarOpen = signal(false);
  studentRoutes = STUDENT_ROUTES;

  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isProfilePanelOpen = false;
  isNotificationsPanelOpen = false;

  isAiBotEnabled = false;
  isNotificationAlerts = true;

  userProfile = {
    fullName: 'Student',
    email: '',
    phone: '',
    city: ''
  };

  notificationsFeed = [
    { id: 1, type: 'assignment', icon: 'fas fa-tasks', bg: 'blue', title: 'New Mock Test Available', text: 'Your Comprehensive Practice Exam is now open.', time: '10 mins ago' },
    { id: 2, type: 'achievement', icon: 'fas fa-trophy', bg: 'gold', title: 'Weekly Goal Achieved!', text: 'Fantastic work! You completed your streak goal early.', time: '2 hours ago' },
    { id: 3, type: 'system', icon: 'fas fa-sparkles', bg: 'purple', title: 'AI Recommendation Ready', text: 'Based on your progress, your AI guide suggests revising notes.', time: 'Yesterday' }
  ];

  isBubbleOpen = false;
  copilotMode: 'motivate' | 'doubt' = 'motivate';
  displayedMessage = '';
  isTyping = false;
  private typingTimer: any;
  private motivationQuotes = [
    "Consistency turns average efforts into spectacular achievements. Keep pushing!",
    "Every mistake made during your mock practice is just a lesson learned before the real exam day.",
    "Your future self will look back today and be deeply grateful for the hard work you put in.",
    "Focus completely on your progress tracker, not on perfection.",
    "Success doesn't just find you; you have to go out there and work for it."
  ];

  get examId(): string {
    return 'neet';
  }

  ngOnInit(): void {
    this.userProfile.email = this.auth.getEmail() || '';

    // Proactive token refresh - check every 60 seconds
    this.refreshInterval = setInterval(() => {
      if (this.tokenService.isExpiringSoon() && this.auth.hasRefreshToken()) {
        this.auth.refreshToken().subscribe({
          error: () => this.auth.logout()
        });
      }
    }, 60000);

    setTimeout(() => {
      if (!this.isBubbleOpen && this.isAiBotEnabled) {
        this.openBotWithNewQuote();
      }
    }, 2500);
  }

  ngOnDestroy(): void {
    if (this.typingTimer) clearInterval(this.typingTimer);
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  switchCopilotMode(mode: 'motivate' | 'doubt'): void {
    if (this.isTyping) return;
    this.copilotMode = mode;
    if (mode === 'motivate') this.openBotWithNewQuote();
  }

  toggleBubble(): void {
    this.isBubbleOpen = !this.isBubbleOpen;
    if (this.isBubbleOpen && !this.displayedMessage) {
      this.copilotMode = 'motivate';
      this.openBotWithNewQuote();
    }
  }

  closeBubble(event?: Event): void {
    if (event) event.stopPropagation();
    this.isBubbleOpen = false;
  }

  dismissBotTrigger(event: Event): void {
    event.stopPropagation();
    this.isAiBotEnabled = false;
    this.isBubbleOpen = false;
  }

  onAiBotToggleChange(): void {
    if (!this.isAiBotEnabled) {
      this.isBubbleOpen = false;
    }
  }

  goBackToMotivation(): void {
    this.copilotMode = 'motivate';
    this.openBotWithNewQuote();
  }

  generateNewQuote(event: Event): void {
    event.stopPropagation();
    this.openBotWithNewQuote();
  }

  private openBotWithNewQuote(): void {
    this.isBubbleOpen = true;
    const randomIndex = Math.floor(Math.random() * this.motivationQuotes.length);
    this.typeMessage(this.motivationQuotes[randomIndex]);
  }

  private typeMessage(fullText: string): void {
    if (this.typingTimer) clearInterval(this.typingTimer);
    this.displayedMessage = '';
    this.isTyping = true;
    let charIndex = 0;

    this.typingTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        this.displayedMessage += fullText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typingTimer);
        this.isTyping = false;
      }
    }, 20);
  }

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      return;
    }
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleProfile(): void {
    this.isProfilePanelOpen = !this.isProfilePanelOpen;
    this.isNotificationsPanelOpen = false;
  }

  toggleNotifications(): void {
    this.isNotificationsPanelOpen = !this.isNotificationsPanelOpen;
    this.isProfilePanelOpen = false;
  }

  closeAllPanels(): void {
    this.isMobileMenuOpen = false;
    this.isProfilePanelOpen = false;
    this.isNotificationsPanelOpen = false;
  }

  removeNotification(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationsFeed = this.notificationsFeed.filter(n => n.id !== id);
  }

  logout(): void {
    this.auth.logout();
  }
}
