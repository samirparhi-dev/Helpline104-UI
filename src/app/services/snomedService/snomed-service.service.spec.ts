import { TestBed, inject } from '@angular/core/testing';

import { SnomedService } from './snomed-service.service';

describe('SnomedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnomedService]
    });
  });

  it('should be created', inject([SnomedService], (service: SnomedService) => {
    expect(service).toBeTruthy();
  }));
});
