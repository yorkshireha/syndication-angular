import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
	apiPrefix: string = 'http://www.yorkshireha.org.uk/e107_plugins/yha_pages/lmGet.json?';

  constructor(private http: HttpClient) { }
  
  public getLeaguesList() {
  	const api = this.apiPrefix + 'list';
  	return this.http.get(api);
  }

  public getTables(id: number) {
  	const api = this.apiPrefix + 'tables=' + id;
  	return this.http.get(api);
  }

}
