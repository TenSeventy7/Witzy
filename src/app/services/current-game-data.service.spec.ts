import { TestBed } from '@angular/core/testing';

import { CurrentGameDataService } from './current-game-data.service';

describe('CurrentGameDataService', () => {
  let service: CurrentGameDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentGameDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
