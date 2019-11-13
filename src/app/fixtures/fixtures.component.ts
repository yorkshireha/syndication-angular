import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html'
})
export class FixturesComponent implements OnInit {
  leagueId;
  filterForm: FormGroup;
  leagueData;
  filterData;
  fixturesData;
  clubSelected = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.formBuilder.group({
      date: [''],
      division: [''],
      club: [''],
      team: [''],
      game: [''],
      venueName: [''],
      homeAway: ['']
    });
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.params);

    if (this.route.snapshot.params.league) {
      this.leagueId = this.route.snapshot.params.league;
      this.getViewData();
    }
  }

  getViewData(): void {
    this.getFilterData();
    this.getFixturesData();
  }

  getFilterData(): void {
    this.apiService.getFixturesForm(this.leagueId)
      .subscribe((data: any) => {
        console.log('getFilterData', data);

        data.games = [
          'All',
          'Confirmed result',
          'Unconfirmed result',
          'Unplayed'
        ];

        data.homeAway = [
          'All',
          'Home',
          'Away'
        ];

        data.teams = [
          {0:   'All teams'},
          {1:   '1'},
          {2:   '2'},
          {3:   '3'},
          {4:   '4'},
          {5:   '5'},
          {6:   '6'},
          {7:   '7'},
          {8:   '8'},
          {9:   '9'},
          {10: '10'}
        ];

        this.filterData = data;
        console.log(this.filterForm);

        this.filterForm.setValue({
          date: this.filterData.dates[1].datestamp,
          division: '',
          club: '',
          team: '',
          game: 0,
          venueName: '',
          homeAway: 0
        });

        this.onFilterChanges();

      }, err => {
          console.log(err);
      });
  }

  getFixturesData(): void {
    this.apiService.getFixtures(this.leagueId)
      .subscribe((data) => {
        console.log('getFixturesDate', data);
        this.fixturesData = this.filterFixtures(data);
      }, err => {
        console.log(err);
      });
  }

  filterFixtures(data) {
    const filter = this.filterForm.value;

    console.log(filter);
    data.forEach(division => {
      const newFixtures = [];

      if (filter.division !== '' && filter.division !== division.name) {
        division.fixtures = newFixtures;
      }

      division.fixtures.forEach(fixture => {
        let keepFixture = true;

        if (filter.date !== '' && filter.date !== fixture.datestamp) {
          keepFixture = false;
        }

        if (filter.club !== '') {
          if (filter.club !== fixture.homeClub && filter.club !== fixture.awayClub) {
            keepFixture = false;
          } else {
            if (filter.homeAway === 1 && filter.club !== fixture.homeClub) {
              keepFixture = false;
            } else if (filter.homeAway === 2 && filter.club !== fixture.awayClub) {
              keepFixture = false;
            }
            if (filter.team > 0) {
              const team = filter.club + ' ' + filter.team;
              if (fixture.homeTeam !== team && fixture.awayTeam !== team ) {
                keepFixture = false;
              }
            }
          }
        }


        if (filter.game > 0 && filter.game !== fixture.game) {
           keepFixture = false;
        }

        if (filter.venueName !== '' && filter.venueName !== fixture.venueName) {
           keepFixture = false;
        }

        if (keepFixture) {
          newFixtures.push(fixture);
        }
      });

      division.fixtures = newFixtures;

    });

    console.log(data);
    return data;
  }

  onLeagueChange(event): void {
    console.log(event, this.route);
    this.leagueId = event.leagueId;
    this.router.navigate(['fixtures', {league: this.leagueId}]).then( e => {
      if (e) {
        console.log('Navigation is successful!', e);
        this.getViewData();
      } else {
        console.log('Navigation has failed!', e);
      }
    });
  }

  onFilterChanges(): void {
    this.filterForm.valueChanges.subscribe(values => {
      console.log(values);
      this.clubSelected = values.club != '';
      this.getFixturesData();
    });
  }

}
