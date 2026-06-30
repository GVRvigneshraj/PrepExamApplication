import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../../features/dashboard/shared/header/header';
import { Sidebar } from '../../features/dashboard/shared/sidebar/sidebar';
import { MobileMenu } from '../../features/dashboard/shared/mobile-menu/mobile-menu';
import { FormsModule } from '@angular/forms';
import { AiChat } from '../../features/dashboard/pages/ai-chat/ai-chat';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterOutlet, Header, Sidebar, MobileMenu,AiChat],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isProfilePanelOpen = false;
  isNotificationsPanelOpen = false;

  // Widget Controls
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.isBubbleOpen) this.openBotWithNewQuote();
    }, 2500);
  }

  ngOnDestroy(): void {
    if (this.typingTimer) clearInterval(this.typingTimer);
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

  // Generic frame layout handlers
  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      return;
    }
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  toggleProfile(): void { this.isProfilePanelOpen = !this.isProfilePanelOpen; this.isNotificationsPanelOpen = false; }
  toggleNotifications(): void { this.isNotificationsPanelOpen = !this.isNotificationsPanelOpen; this.isProfilePanelOpen = false; }
  closeAllPanels(): void { this.isMobileMenuOpen = false; this.isProfilePanelOpen = false; this.isNotificationsPanelOpen = false; }
  logout(): void { localStorage.clear(); this.router.navigate(['/login']); }
}