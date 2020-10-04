import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { ApiService } from '../api.service';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        height: 0,
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.25s')
      ]),
      transition('closed => open', [
        animate('0.25s')
      ])
    ])
  ]
})
export class FixturesComponent implements OnInit {
  leagueId;
  filterForm: FormGroup;
  leagueData;
  filterData;
  fixturesData;
  clubSelected = false;
  isFilterOpen = false;
  club;
  team;
  hideSpinner = false;
  hideFilters = true;
  hideFixtures = true;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private datastoreService: DatastoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.leagueId = this.datastoreService.getLeagueId();
    this.filterForm = this.formBuilder.group({
      date: [''],
      division: [''],
      club: [''],
      team: [''],
      status: [''],
      venueName: [''],
      homeAway: ['']
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params.league) {
      this.leagueId = this.route.snapshot.params.league;
    }
    if (this.route.snapshot.params.club) {
      this.club = this.route.snapshot.params.club;
    }
    if (this.route.snapshot.params.team) {
      this.team = this.route.snapshot.params.team;
    }

    this.getViewData();
  }

  getViewData(): void {
    if (this.leagueId) {
      this.getFilterData();
      this.getFixturesData();
    } else {
      this.isSpinnerNeeded();
    }
  }

  getFilterData(): void {
    this.apiService.getFixturesForm(this.leagueId).subscribe((data: any) => {

      data.statuses = [
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

      let today: any = new Date();
      today.setHours(0, 0, 0, 0);
      today = Date.parse(today.toString());
      const found = this.filterData.dates.find(timestamp => timestamp.datestamp > today);

      this.filterForm.setValue({
        date: this.club ? '' : found.datestamp,
        division: '',
        club: this.club ? this.club : '',
        team: this.team ? this.team : '',
        status: 0,
        venueName: '',
        homeAway: 0
      });

      this.clubSelected = this.club ? true : false;
      this.onFilterChanges();

      this.hideFilters = false;
      this.isSpinnerNeeded();
    }, err => {
        console.log(err);
    });
  }

  getFixturesData(): void {
    this.apiService.getFixtures(this.leagueId).subscribe((data) => {
      this.fixturesData = this.filterFixtures(JSON.parse(JSON.stringify(data)));
    }, err => {
      console.log(err);
    });
  }

  filterFixtures(data) {
    const filter = this.filterForm.value;

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


        if (filter.status > 0 && filter.status !== fixture.status) {
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

    this.hideFixtures = false;
    this.isSpinnerNeeded();
    return data;
  }

  onLeagueFormLoaded(event) {
    this.hideFilters = false;
    this.isSpinnerNeeded();
  }

  onLeagueChange(event): void {
    this.leagueId = event.leagueId;
    this.router.navigate(['fixtures', {league: this.leagueId}]).then( e => {
      if (e) {
        this.hideFixtures = true;
        this.isSpinnerNeeded();
        this.getViewData();
      } else {
        console.log('Navigation has failed!', e);
      }
    });
  }

  onFilterChanges(): void {
    this.filterForm.valueChanges.subscribe(values => {
      this.clubSelected = values.club !== '';
      this.isSpinnerNeeded();
      this.getFixturesData();
    });
  }

  onTeamSelect(event, clubName, teamName): void {
    const teamNumber = teamName.substr(teamName.lastIndexOf(' ') + 1);
    event.preventDefault();
    this.router.navigate(['fixtures', {
      league: this.leagueId,
      club: clubName,
      team: teamNumber
    }]).then( e => {
      if (e) {
        this.ngOnInit();
      } else {
        console.log('Navigation has failed!', e);
      }
    });
  }

  toggleFilterForm() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  isSpinnerNeeded() {
    this.hideSpinner = !(this.hideFilters && this.hideFixtures);
  }
}
