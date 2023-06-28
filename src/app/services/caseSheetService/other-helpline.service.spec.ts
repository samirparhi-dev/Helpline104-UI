import { TestBed, inject } from '@angular/core/testing';

import { OtherHelplineService } from './other-helpline.service';

describe('OtherHelplineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OtherHelplineService]
    });
  });

  it('should be created', inject([OtherHelplineService], (service: OtherHelplineService) => {
    expect(service).toBeTruthy();
  }));
});
