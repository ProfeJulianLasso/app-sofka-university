import { TestBed } from '@angular/core/testing';

import { SignInSignUpService } from './sign-in-sign-up.service';

describe('SignInSignUpService', () => {
  let service: SignInSignUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignInSignUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
