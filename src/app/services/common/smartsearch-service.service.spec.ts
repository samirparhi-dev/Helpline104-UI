import { TestBed, inject } from '@angular/core/testing';

import { SmartsearchServiceService } from './smartsearch-service.service';

describe('SmartsearchServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartsearchServiceService]
    });
  });

  it('should be created', inject([SmartsearchServiceService], (service: SmartsearchServiceService) => {
    expect(service).toBeTruthy();
  }));
});
