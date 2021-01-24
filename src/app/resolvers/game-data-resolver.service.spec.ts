import { TestBed } from '@angular/core/testing';

import { GameDataResolverService } from './game-data-resolver.service';

describe('GameDataResolverService', () => {
  let service: GameDataResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDataResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
