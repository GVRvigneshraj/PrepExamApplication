import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule],
  templateUrl: './login.html',
  // styleUrl: './login.scss',
   styleUrls: ['./login.scss']

})
export class Login implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;

  isLoading = false;
  submitted = false;

  // Demo OTP
  demoOtp = '1234';

  private getRedirectUrl(): string {
    const queryParam = this.route.snapshot.queryParamMap.get('returnUrl')
      || this.route.snapshot.queryParamMap.get('backUrl');

    const navigationState = this.router.getCurrentNavigation()?.extras.state as
      | { returnUrl?: string; backUrl?: string }
      | undefined;

    const stateParam = navigationState?.returnUrl || navigationState?.backUrl;
    const fallbackUrl = (queryParam || stateParam || '/onboarding').trim();

    if (!fallbackUrl || fallbackUrl === 'back' || fallbackUrl === 'previous') {
      return '/onboarding';
    }

    if (fallbackUrl.startsWith('/') || fallbackUrl.startsWith('./') || fallbackUrl.startsWith('../')) {
      return fallbackUrl;
    }

    return '/onboarding';
  }

  onSubmit(): void {
    this.onLogin();
  }


  ngOnInit(): void {
    this.buildForm();

    // Already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
      const exam = localStorage.getItem('selectedExam');
      const redirectUrl = this.getRedirectUrl();

      if (redirectUrl && redirectUrl !== '/onboarding') {
        this.router.navigateByUrl(redirectUrl);
      } else if (exam) {
        this.router.navigate([`/${exam}/dashboard`]);
      } else {
        this.router.navigate(['/onboarding']);
      }
    }
  }

  buildForm(): void {

    this.loginForm = this.fb.group({

      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],

      otp: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ]
      ]

    });

  }

  get f() {
    return this.loginForm.controls;
  }

  onLogin(): void {

    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const mobile = this.loginForm.value.mobile;
    const otp = this.loginForm.value.otp;

    // Demo OTP Validation

    setTimeout(() => {

      if (otp === this.demoOtp) {

        localStorage.setItem('isLoggedIn', 'true');

        localStorage.setItem('mobile', mobile);

        this.isLoading = false;

        this.router.navigateByUrl(this.getRedirectUrl());

      } else {

        this.isLoading = false;

        alert('Invalid OTP\n\nDemo OTP : 1234');

      }

    }, 1500);

  }

  goToRegister(): void {

    this.router.navigate(['/register']);

  }

  clearForm(): void {

    this.loginForm.reset();

    this.submitted = false;

  }

}