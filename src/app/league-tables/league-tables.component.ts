import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-tables.component.html'
})
export class LeagueTablesComponent implements OnInit {
  leagueForm: FormGroup;
  filterForm: FormGroup;
  leaguesList;
  leagueData;
  divisionsDataFiltered;
  divisionList: array;

  get divisions() {
    return this.filterForm.get('divisions') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.leagueForm = this.formBuilder.group({
      leaguesList: ['']
    });

    this.filterForm = this.formBuilder.group({
      divisions: this.formBuilder.array([])
    });

    this.getLeaguesList();
  }

  ngOnInit() {
    console.log(this.route.snapshot);
    console.log(this.route.snapshot.params);

    if (this.route.snapshot.params.league) {
      console.log(this.route.snapshot.params.league);
      this.getLeagueData();
    }
    this.onLeagueChanges();
  }

  getViewData() {
    this.getLeagueData();
  }

  getLeaguesList() {
    this.apiService.getLeaguesList()
      .subscribe((data) => {
        console.log(data);
        this.leaguesList = data;
        }, err => {
          console.log(err);
        }
      );
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
    this.divisionList = [];
    this.leagueData.divisions.forEach(division => {
      this.divisions.push(this.formBuilder.control(true));
      this.divisionList.push(division.longName);
    });

    this.onFilterChanges();

  }

  onLeagueChanges(): void {
    this.leagueForm.valueChanges.subscribe(values => {
      console.log(values, this.route);
      this.router.navigate(['tables', {league: values.leaguesList}]).then( e => {
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
      this.filterLeagueData();
    });
  }

}
