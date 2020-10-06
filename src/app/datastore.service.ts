import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  data = {
    leagueId: 0
  };

  constructor() {
    const storage = localStorage.getItem('leagmanStore');
    if (storage) {
      this.data = JSON.parse(storage);
    }
  }

  setLocalStorage() {
    localStorage.setItem('leagmanStore', JSON.stringify(this.data));
  }

  getLeagueId() {
    return this.data.leagueId;
  }
  setLeagueId(id: number) {
    this.data.leagueId = id;
    this.setLocalStorage();
  }
}
