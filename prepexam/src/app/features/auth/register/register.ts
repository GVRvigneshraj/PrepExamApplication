import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  showToast = false;
  errorMessage = '';

  // Visibility toggle states
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Strong password pattern: Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$';

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.pattern(strongPasswordPattern)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validates that password and confirmPassword match perfectly
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Getters for form template feedback state
  get passwordControl() {
    return this.registerForm.get('password');
  }

  get isPasswordInvalidAndTouched(): boolean {
    return !!(this.passwordControl?.invalid && (this.passwordControl?.touched || this.passwordControl?.dirty));
  }

  get passwordsMatch(): boolean {
    const pass = this.registerForm.get('password')?.value;
    const confirm = this.registerForm.get('confirmPassword')?.value;
    return pass && confirm && !this.registerForm.hasError('mismatch');
  }

  get hasConfirmPasswordValue(): boolean {
    return !!this.registerForm.get('confirmPassword')?.value;
  }

  handleAction(): void {
    if (this.registerForm.valid && this.passwordsMatch) {
      this.isSubmitting = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.showToast = true;
          this.isSubmitting = false;

          setTimeout(() => {
            this.showToast = false;
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}