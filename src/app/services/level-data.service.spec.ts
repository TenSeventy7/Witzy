import { TestBed } from '@angular/core/testing';

import { LevelDataService } from './level-data.service';

describe('LevelDataService', () => {
  let service: LevelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
