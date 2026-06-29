import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',

})
export class Login implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm!: FormGroup;

  isLoading = false;
  submitted = false;

  // Demo OTP
  demoOtp = '1234';

  ngOnInit(): void {
    this.buildForm();

    // Already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {

      const exam = localStorage.getItem('selectedExam');

      if (exam) {
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

        this.router.navigate(['/onboarding']);

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