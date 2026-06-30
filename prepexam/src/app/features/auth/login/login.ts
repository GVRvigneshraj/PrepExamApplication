import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isOtpSent = false;
  isSubmitting = false;
  demoOtpHint = '1234';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      otpDigits: this.fb.array([
        ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        ['', [Validators.required, Validators.pattern('^[0-9]$')]]
      ])
    });
  }

  get otpDigits(): FormArray {
    return this.loginForm.get('otpDigits') as FormArray;
  }

  handleAction(): void {
    if (!this.isOtpSent) {
      if (this.loginForm.get('mobileNumber')?.valid) {
        this.isOtpSent = true;
      }
    } else {
      if (this.loginForm.valid) {
        this.verifyAndLogin();
      }
    }
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Sanitize non-numeric input values
    if (value && !/^[0-9]$/.test(value)) {
      input.value = '';
      this.otpDigits.at(index).setValue('');
      return;
    }

    // Move to next input block automatically
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    // Handle backspace navigation backwards
    if (event.key === 'Backspace' && !this.otpDigits.at(index).value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        // Clear value on focus back to improve accessibility
        this.otpDigits.at(index - 1).setValue('');
      }
    }
  }

  verifyAndLogin(): void {
    const enteredOtp = this.otpDigits.value.join('');
    if (enteredOtp === this.demoOtpHint) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/onboarding']); // Update destination link path here
      }, 1500);
    } else {
      alert('Invalid Verification Code. Please use the demo code: 1234');
    }
  }
}
