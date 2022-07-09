import { TestBed } from '@angular/core/testing';

import { IsAuthIndexGuard } from './is-auth-index.guard';

describe('IsAuthIndexGuard', () => {
  let guard: IsAuthIndexGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAuthIndexGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
