import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LeagueService } from './league.service';

describe('LeagueService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [LeagueService]
  }));

  it('should be created', () => {
    const service: LeagueService = TestBed.get(LeagueService);
    expect(service).toBeTruthy();
  });
});
