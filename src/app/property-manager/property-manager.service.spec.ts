import { TestBed } from '@angular/core/testing';

import { PropertyManagerService } from './property-manager.service';

describe('PropertyManagerService', () => {
  let service: PropertyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
