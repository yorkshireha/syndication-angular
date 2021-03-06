import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiPrefix = 'http://www.yorkshireha.org.uk/e107_plugins/yha_pages/lmGet.php?';

  constructor(private http: HttpClient) { }

  public getLeaguesList() {
    const api = this.apiPrefix + 'leagues';
    return this.http.get(api);
  }

  public getTables(id: number) {
    const api = this.apiPrefix + 'tables=' + id;
    return this.http.get(api);
  }

  public getFixturesForm(id: number) {
    const api = this.apiPrefix + 'fixturesForm=' + id;
    return this.http.get(api);
  }

  public getFixtures(id: number) {
    const api = this.apiPrefix + 'fixtures=' + id;
    return this.http.get(api);
  }

  public getClubsList() {
    const api = this.apiPrefix + 'clubs';
    return this.http.get(api);
  }

  public getClub(id: number) {
    const api = this.apiPrefix + 'club=' + id;
    return this.http.get(api);
  }

  public getVenuesList() {
    const api = this.apiPrefix + 'venues';
    return this.http.get(api);
  }

  public getVenue(id: number) {
    const api = this.apiPrefix + 'venue=' + id;
    return this.http.get(api);
  }

}
