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
  imports: [CommonModule, FormsModule, RouterOutlet, Header, Sidebar, MobileMenu, AiChat],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isProfilePanelOpen = false;
  isNotificationsPanelOpen = false;

  // Feature Settings Toggles
  isAiBotEnabled = true;       
  isNotificationAlerts = true;  

  // Enhanced Personal Info State Object
  userProfile = {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@domain.com',
    phone: '+1 (555) 019-2834',
    city: 'New York'
  };

  // Mock Notification Feed Stack
  notificationsFeed = [
    { id: 1, type: 'assignment', icon: 'fas fa-tasks', bg: 'blue', title: 'New Mock Test Available', text: 'Your Comprehensive Mathematics Practice Exam III is now open.', time: '10 mins ago' },
    { id: 2, type: 'achievement', icon: 'fas fa-trophy', bg: 'gold', title: 'Weekly Goal Achieved!', text: 'Fantastic work! You completed your streak assignment goal 2 days early.', time: '2 hours ago' },
    { id: 3, type: 'system', icon: 'fas fa-sparkles', bg: 'purple', title: 'AI Recommendation Ready', text: 'Based on your recent progress, your virtual guide suggests revising physics notes.', time: 'Yesterday' }
  ];

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
      if (!this.isBubbleOpen && this.isAiBotEnabled) {
        this.openBotWithNewQuote();
      }
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

  // Closes the widget bubble AND auto-disables the settings panel switch toggle
  dismissBotTrigger(event: Event): void {
    event.stopPropagation();
    this.isAiBotEnabled = false; 
    this.isBubbleOpen = false;
  }

  // Triggers immediate opening behavior when user flips profile view switch back to ON
  onAiBotToggleChange(): void {
    if (this.isAiBotEnabled && !this.isBubbleOpen) {
      // this.openBotWithNewQuote();
    } else if (!this.isAiBotEnabled) {
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
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}