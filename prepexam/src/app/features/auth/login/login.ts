import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { TokenService } from '../../../core/auth/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  showToast = false;
  loginErrorMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private storage: StorageService,
    private jwt: TokenService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailOrMobile: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginErrorMessage) {
        this.loginErrorMessage = '';
      }

      if (this.emailOrMobileControl?.hasError('invalidCredentials')) {
        const errors = { ...this.emailOrMobileControl.errors };
        delete errors['invalidCredentials'];
        this.emailOrMobileControl.setErrors(Object.keys(errors).length ? errors : null);
      }

      if (this.passwordControl?.hasError('invalidCredentials')) {
        const errors = { ...this.passwordControl.errors };
        delete errors['invalidCredentials'];
        this.passwordControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    });
  }

  get emailOrMobileControl() {
    return this.loginForm.get('emailOrMobile');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  handleAction(): void {
    this.loginErrorMessage = '';

    if (this.loginForm.valid) {
      this.isSubmitting = true;

      const payload = {
        ...this.loginForm.value,
        deviceId: 'web-' + Date.now()
      };

      this.authService.login(payload).subscribe({
        next: (res) => {
          if (res && res.success) {
            this.showToast = true;
            this.isSubmitting = false;
            this.cdr.detectChanges();

            setTimeout(() => {
              this.showToast = false;
              this.cdr.detectChanges();
              this.authService.navigateAfterLogin();
            }, 2000);
          } else {
            this.isSubmitting = false;
            this.loginErrorMessage = res.message || 'Invalid credentials.';
            this.emailOrMobileControl?.setErrors({ invalidCredentials: true });
            this.passwordControl?.setErrors({ invalidCredentials: true });
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.loginErrorMessage = err?.error?.message || 'Invalid credentials. Please try again.';
          this.emailOrMobileControl?.setErrors({ invalidCredentials: true });
          this.passwordControl?.setErrors({ invalidCredentials: true });
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
