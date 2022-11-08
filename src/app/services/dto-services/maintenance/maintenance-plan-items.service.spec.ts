import { TestBed } from '@angular/core/testing';

import { MaintenancePlanItemsService } from './maintenance-plan-items.service';

describe('MaintenancePlanItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaintenancePlanItemsService = TestBed.get(MaintenancePlanItemsService);
    expect(service).toBeTruthy();
  });
});
