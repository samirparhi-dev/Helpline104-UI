import { TestBed, inject } from '@angular/core/testing';

import { BalVivahServiceService } from './bal-vivah-service.service';

describe('BalVivahServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BalVivahServiceService]
    });
  });

  it('should be created', inject([BalVivahServiceService], (service: BalVivahServiceService) => {
    expect(service).toBeTruthy();
  }));
});
