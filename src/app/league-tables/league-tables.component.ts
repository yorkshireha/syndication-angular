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
      this.divisionsDataFiltered = [...this.leagueData.divisions];
      this.getFilterData();
    }, err => {
      console.log(err);
    });
  }

  filterLeagueData() {
    this.divisionsDataFiltered = [];
    this.leagueData.divisions.forEach((division, ix) => {
      if (this.divisions.value[ix]) {
        this.divisionsDataFiltered.push(division);
      }
    });
  }

  getFilterData(): void {
    this.filterForm = this.formBuilder.group({
      divisions: this.formBuilder.array([])
    });
    this.divisionList = [];
    this.leagueData.divisions.forEach(division => {
      this.divisions.push(this.formBuilder.control(true));
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
      this.filterLeagueData();
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

  toggleDeductions(id) {
    document.getElementById(id).classList.toggle('hidden');
  }
}
