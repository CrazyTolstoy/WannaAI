import { TestBed } from '@angular/core/testing';

import { DynamicLoaderServiceService } from './dynamic-loader-service.service';

describe('DynamicLoaderServiceService', () => {
  let service: DynamicLoaderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicLoaderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
