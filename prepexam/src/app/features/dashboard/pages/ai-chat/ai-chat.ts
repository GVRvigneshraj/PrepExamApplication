import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
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
export class AiChat implements OnInit, AfterViewChecked {
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  messages = signal<WhatsAppMessage[]>([]);
  userInputText = signal<string>('');
  isAiThinking = signal<boolean>(false);

  // Instant trigger upon module mounting initialization
  ngOnInit(): void {
    this.triggerOnloadGreeting();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private triggerOnloadGreeting(): void {
    const welcomeText = "Hello! I am your Gemini Academic Assistant. How can I help you analyze your performance metrics or study plan today? ✨";
    
    // Slight pause for design aesthetics, then begin rendering text character-by-character
    setTimeout(() => {
      this.triggerCharacterStreamingAnimation(welcomeText);
    }, 400);
  }

  handleKeydown(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.submitUserMessage();
    }
  }

  submitUserMessage(): void {
    const textSnapshot = this.userInputText().trim();
    if (!textSnapshot || this.isAiThinking()) return;

    this.messages.update(prev => [...prev, { sender: 'user', text: textSnapshot }]);
    this.userInputText.set('');
    this.resetInputHeight();

    this.isAiThinking.set(true);
    
    setTimeout(() => {
      this.isAiThinking.set(false);
      const aiReply = "Looking over your metrics, your Mathematics accuracy is a solid 92%. However, your Chemistry average dropped to 68%. I suggest we launch a focused 10-question practice set right now to clean up those areas.";
      this.triggerCharacterStreamingAnimation(aiReply);
    }, 1200);
  }

  private triggerCharacterStreamingAnimation(fullOutputText: string): void {
    this.messages.update(prev => [...prev, { sender: 'ai', text: '' }]);
    
    let charIdx = 0;
    const totalChars = fullOutputText.length;
    
    const streamInterval = setInterval(() => {
      if (charIdx < totalChars) {
        const structuralChunk = fullOutputText.substring(0, charIdx + 1);
        
        this.messages.update(prev => {
          const freshCopy = [...prev];
          freshCopy[freshCopy.length - 1] = { sender: 'ai', text: structuralChunk };
          return freshCopy;
        });
        
        charIdx++;
        this.scrollToBottom(); // Auto-scroll downward dynamically on every printed letter!
      } else {
        clearInterval(streamInterval);
      }
    }, 15);
  }

  formatMessageTime(): string {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private resetInputHeight(): void {
    if (this.chatInput) {
      this.chatInput.nativeElement.style.height = 'auto';
    }
  }
}