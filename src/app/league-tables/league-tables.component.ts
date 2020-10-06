import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { ApiService } from '../api.service';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-tables.component.html',
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
export class LeagueTablesComponent implements OnInit {
  leagueId;
  filterForm: FormGroup;
  leagueData;
  divisionsDataFiltered;
  divisionList;
  isFilterOpen = false;

  get divisions() {
    return this.filterForm.get('divisions') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private datastoreService: DatastoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.leagueId = this.datastoreService.getLeagueId();
    this.filterForm = this.formBuilder.group({
      divisions: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    if (this.route.snapshot.params.league) {
      this.leagueId = this.route.snapshot.params.league;
    }
    if (this.leagueId) {
      this.getLeagueData();
    }
  }

  getLeagueData() {
    this.apiService.getTables(this.leagueId).subscribe((data: any) => {
      this.leagueData = data.league;
      this.getFilterData();
    }, err => {
      console.log(err);
    });
  }

  getFilterData(): void {
    const divisionsQP = this.route.snapshot.params.divisions;

    this.filterForm = this.formBuilder.group({
      divisions: this.formBuilder.array([])
    });

    this.divisionsDataFiltered = [];
    if (divisionsQP) {
      this.divisionsDataFiltered = this.leagueData.divisions.filter(el => divisionsQP.indexOf(el.shortName) > -1);
    } else {
      this.divisionsDataFiltered = [...this.leagueData.divisions];
    }

    this.divisionList = [];
    this.leagueData.divisions.forEach(division => {
      this.divisions.push(this.formBuilder.control(this.divisionsDataFiltered.includes(division)));
      this.divisionList.push(division.longName);
    });

    this.onFilterChanges();
  }

  onLeagueChange(event): void {
    this.leagueId = event.leagueId;
    this.router.navigate(['tables', {league: event.leagueId}]).then( e => {
      if (e) {
        this.getLeagueData();
      } else {
        console.log('Navigation has failed!', e);
      }
    });
  }

  onFilterChanges(): void {
    this.filterForm.valueChanges.subscribe(values => {
      const divisions = values.divisions;
      let divisionShortNames = [];
      console.log(values);

      divisionShortNames = this.leagueData.divisions.reduce((currentValue, el, ix) => {
        return divisions[ix] ? currentValue + (currentValue.length ? ',' : '') + el.shortName : currentValue;
      }, '');

      console.log(divisionShortNames);
      this.router.navigate(['tables', {
        league: this.leagueId,
        divisions: divisionShortNames
      }]).then( e => {
        if (e) {
          this.ngOnInit();
        } else {
          console.log('Navigation has failed!', e);
        }
      });
    });
  }

  onTeamSelect(event, clubName, teamName): void {
    const teamNumber = teamName.substr(teamName.lastIndexOf(' ') + 1);
    const params = {
      league: this.leagueId,
      club: clubName,
      team: teamNumber
    };

    console.log(params);
    event.preventDefault();
    this.router.navigate(['fixtures', params]).then( e => {
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

  toggleDeductions(id) {
    document.getElementById(id).classList.toggle('hidden');
  }
}
