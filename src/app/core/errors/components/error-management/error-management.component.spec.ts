import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorManagementComponent } from './error-management.component';

describe('ErrorManagementComponent', () => {
  let component: ErrorManagementComponent;
  let fixture: ComponentFixture<ErrorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorManagementComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
