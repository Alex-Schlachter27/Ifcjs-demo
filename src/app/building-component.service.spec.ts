import { TestBed } from '@angular/core/testing';

import { BuildingComponentService } from './building-component.service';

describe('BuildingComponentService', () => {
  let service: BuildingComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
