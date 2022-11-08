import { TestBed } from '@angular/core/testing';

import { ScrapCauseService } from './scrap-cause.service';

describe('ScrapCauseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrapCauseService = TestBed.get(ScrapCauseService);
    expect(service).toBeTruthy();
  });
});
