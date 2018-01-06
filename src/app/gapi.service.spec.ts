import { TestBed, inject } from '@angular/core/testing';

import { GApiService } from './gapi.service';

describe('GapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GApiService]
    });
  });

  it('should be created', inject([GApiService], (service: GApiService) => {
    expect(service).toBeTruthy();
  }));
});
