import { TestBed } from '@angular/core/testing';

import { CurrentGameDataResolverService } from './current-game-data-resolver.service';

describe('CurrentGameDataResolverService', () => {
  let service: CurrentGameDataResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentGameDataResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
