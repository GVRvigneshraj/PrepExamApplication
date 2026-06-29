import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Login } from './login';

declare const jasmine: any;

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let routeStub: { snapshot: { queryParamMap: { get: (key: string) => string | null } } };

  beforeEach(async () => {
    routeStub = {
      snapshot: {
        queryParamMap: {
          get: () => null,
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [Login, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: routeStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not navigate for an invalid form', () => {
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = jasmine.createSpy('navigateByUrl');
    (router as any).navigateByUrl = navigateByUrlSpy;

    component.loginForm.setValue({ mobile: '123', otp: '12' });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form.login-form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });

  it('should navigate to onboarding after a successful login', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = jasmine.createSpy('navigateByUrl');
    (router as any).navigateByUrl = navigateByUrlSpy;

    component.loginForm.setValue({ mobile: '9876543210', otp: '1234' });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form.login-form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    tick(1500);

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/onboarding');
  }));

  it('should use a return url after a successful login', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = jasmine.createSpy('navigateByUrl');
    (router as any).navigateByUrl = navigateByUrlSpy;
    routeStub.snapshot.queryParamMap.get = (key: string) => (key === 'returnUrl' ? '/dashboard' : null);

    component.loginForm.setValue({ mobile: '9876543210', otp: '1234' });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form.login-form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    tick(1500);

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/dashboard');
  }));
});
