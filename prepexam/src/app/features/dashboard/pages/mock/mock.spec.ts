import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mock } from './mock';

describe('Mock', () => {
  let component: Mock;
  let fixture: ComponentFixture<Mock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mock],
    }).compileComponents();

    fixture = TestBed.createComponent(Mock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
