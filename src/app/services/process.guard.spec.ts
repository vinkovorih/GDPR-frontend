import { TestBed, async, inject } from '@angular/core/testing';

import { ProcessGuard } from './process.guard';

describe('ProcessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcessGuard]
    });
  });

  it('should ...', inject([ProcessGuard], (guard: ProcessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
