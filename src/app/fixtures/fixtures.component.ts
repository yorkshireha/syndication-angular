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
  leagueForm: FormGroup;
  filterForm: FormGroup;
  gotData = false;
  leagueData;
  filterData;
  fixturesData;

  constructor(
    private formBuilder: FormBuilder,
    private leagueService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.leagueForm = this.formBuilder.group({
      league: [''],
    });

    this.filterForm = this.formBuilder.group({
      date: [''],
      division: [''],
      club: [''],
      team: [''],
      game: [''],
      venueName: [''],
      homeAway: ['']
    });

    this.getLeaguesList();
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.params);

    if (this.route.snapshot.params.league) {
      this.leagueForm.patchValue({
        league: this.route.snapshot.params.league
      });
      this.getViewData();
    }
  }

  getViewData(): void {
    console.log(this.route.snapshot.params.league);
    this.getfilterData();
    this.getFixturesData();
  }

  getLeaguesList(): void {
    this.leagueService.getLeaguesList()
      .subscribe((data) => {
        console.log(data);
        this.leagueData = data;

        this.onLeagueChanges();

      }, err => {
        console.log(err);
      });
  }

  getfilterData(): void {
    this.leagueService.getFixturesForm(this.leagueForm.value.league)
      .subscribe((data: any) => {
        console.log('getfilterData', data);

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
    this.leagueService.getFixtures(this.leagueForm.value.league)
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

  onLeagueChanges(): void {
    this.leagueForm.valueChanges.subscribe(values => {
      console.log(values, this.route);
      this.router.navigate(['fixtures', {league: this.leagueForm.value.league}]).then( e => {
        if (e) {
          console.log('Navigation is successful!', e);
          this.getViewData();
        } else {
          console.log('Navigation has failed!', e);
        }
      });
    });
  }

  onFilterChanges(): void {
    this.filterForm.valueChanges.subscribe(values => {
      console.log(values);
      this.getFixturesData();
       // this.getFixturesData(this.leagueForm.value.league);
    });
  }

}
