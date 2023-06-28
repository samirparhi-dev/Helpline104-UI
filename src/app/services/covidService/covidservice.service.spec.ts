import { TestBed, inject } from '@angular/core/testing';

import { CovidserviceService } from './covidservice.service';

describe('CovidserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CovidserviceService]
    });
  });

  it('should be created', inject([CovidserviceService], (service: CovidserviceService) => {
    expect(service).toBeTruthy();
  }));
});
