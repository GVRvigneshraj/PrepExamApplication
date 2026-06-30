import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isOtpStage = false;
  isSubmitting = false;
  demoOtpHint = '1234';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', [Validators.required]],
      otpDigits: this.fb.array([
        ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        ['', [Validators.required, Validators.pattern('^[0-9]$')]],
        ['', [Validators.required, Validators.pattern('^[0-9]$')]]
      ])
    });
  }

  get otpDigits(): FormArray {
    return this.registerForm.get('otpDigits') as FormArray;
  }

  // Validates current fields before advancing to OTP verification
  isDetailsFormValid(): boolean {
    const fields = ['fullName', 'dob', 'mobileNumber', 'gender', 'email', 'city'];
    return fields.every(field => this.registerForm.get(field)?.valid);
  }

  handleAction(): void {
    if (!this.isOtpStage) {
      if (this.isDetailsFormValid()) {
        this.isOtpStage = true;
      }
    } else {
      if (this.registerForm.valid) {
        this.verifyAndRegister();
      }
    }
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && !/^[0-9]$/.test(value)) {
      input.value = '';
      this.otpDigits.at(index).setValue('');
      return;
    }

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits.at(index).value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        this.otpDigits.at(index - 1).setValue('');
      }
    }
  }

  verifyAndRegister(): void {
    const enteredOtp = this.otpDigits.value.join('');
    if (enteredOtp === this.demoOtpHint) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/onboarding']); // Navigates to onboarding portal on success
      }, 1500);
    } else {
      alert('Invalid Verification Code. Please use the demo code: 1234');
    }
  }
}
