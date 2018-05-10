import { TestBed, async, inject } from '@angular/core/testing';

import { GdprGuard } from './gdpr.guard';

describe('GdprGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GdprGuard]
    });
  });

  it('should ...', inject([GdprGuard], (guard: GdprGuard) => {
    expect(guard).toBeTruthy();
  }));
});
