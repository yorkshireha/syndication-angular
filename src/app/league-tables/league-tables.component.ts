import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-tables.component.html'
})
export class LeagueTablesComponent implements OnInit {
  leagueId;
  filterForm: FormGroup;
  leagueData;
  divisionsDataFiltered;
  divisionList;

  get divisions() {
    return this.filterForm.get('divisions') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.formBuilder.group({
      divisions: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    console.log(this.route.snapshot.params);

    if (this.route.snapshot.params.league) {
      this.leagueId = this.route.snapshot.params.league;
      console.log(this.route.snapshot.params.league);
      this.getLeagueData();
    }
  }

  getLeagueData() {
    this.apiService.getTables(this.route.snapshot.params.league)
      .subscribe((data: any) => {
        console.log('', data);
        console.log('division', data.league.divisions);
        console.log('team', data.league.divisions[0].teams[0]);
        this.leagueData = data.league;
        this.divisionsDataFiltered = [...this.leagueData.divisions];
        console.log('#divisionsDataFiltered', this.divisionsDataFiltered);
        this.getFilterData();
        }, err => {
          console.log(err);
        }
      );
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
    console.log(event, this.route);
    this.router.navigate(['tables', {league: event.leagueId}]).then( e => {
      if (e) {
        console.log('Navigation is successful!', e);
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

}
