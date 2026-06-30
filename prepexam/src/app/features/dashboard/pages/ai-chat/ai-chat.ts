import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface WhatsAppMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss',
})
export class AiChat implements OnInit, OnDestroy {
  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  userQuery = '';
  isTyping = false;
  private typingTimer: any;

  chatHistory: { sender: 'bot' | 'user'; text: string }[] = [
    { sender: 'bot', text: 'Ask me any concept doubt from your syllabus, and I will explain it instantly!' }
  ];

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.typingTimer) clearInterval(this.typingTimer);
  }

  sendMessage(): void {
    if (this.isTyping || !this.userQuery.trim()) return;

    const text = this.userQuery.trim();
    this.userQuery = '';
    this.chatHistory.push({ sender: 'user', text });

    const explanation = `Regarding your query "${text}": Break the configuration setup down methodically, separate variables, and map expressions sequentially. Let me know if you need any specific equation steps analyzed!`;
    
    this.isTyping = true;
    let charIndex = 0;
    const initialLen = this.chatHistory.push({ sender: 'bot', text: '' });
    const targetIdx = initialLen - 1;

    // FIX: Variables synchronized correctly to prevent compilation loop error
    this.typingTimer = setInterval(() => {
      if (charIndex < explanation.length) {
        this.chatHistory[targetIdx].text += explanation.charAt(charIndex);
        charIndex++;
        this.scrollToBottom();
      } else {
        clearInterval(this.typingTimer);
        this.isTyping = false;
      }
    }, 12);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = document.getElementById('subChatScroller');
      if (element) element.scrollTop = element.scrollHeight;
    }, 10);
  }

  onBack(): void { if (!this.isTyping) this.back.emit(); }
  onClose(): void { this.close.emit(); }
}