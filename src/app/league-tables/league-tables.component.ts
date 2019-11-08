import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { LeagueService } from '../league.service';

@Component({
  selector: 'app-league-table',
  templateUrl: './league-tables.component.html'
})
export class LeagueTablesComponent implements OnInit {
  selectForm: FormGroup;
  leaguesList;
  gotData = false;
  league;

  constructor(
    private formBuilder: FormBuilder,
    private leagueService: LeagueService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectForm = this.formBuilder.group({
      leaguesList: ['']
    });

    this.getLeaguesList();
  }

  ngOnInit() {
    console.log(this.route.snapshot);
    console.log(this.route.snapshot.params);

    if (this.route.snapshot.params.league) {
      console.log(this.route.snapshot.params.league);
      this.getLeaguesData(this.route.snapshot.params.league);
    }
    this.onChanges();
  }

  getLeaguesList() {
    this.leagueService.getLeaguesList()
      .subscribe((data) => {
        console.log(data);
        this.leaguesList = data;
        }, err => {
          console.log(err);
        }
      );
  }

  getLeaguesData(id) {
    this.leagueService.getTables(id)
      .subscribe((data: any) => {
        console.log('', data);
        console.log('division', data.league.divisions);
        console.log('team', data.league.divisions[0].teams[0]);
        this.league = data.league;
        console.log('league', this.league);
        this.gotData = true;
        }, err => {
          console.log(err);
        }
      );
  }

  onChanges(): void {
    this.selectForm.valueChanges.subscribe(values => {
      console.log(values, this.route);
      this.router.navigate(['tables', {league: values.leaguesList}]).then( e => {
        if (e) {
          console.log('Navigation is successful!', e);
          this.ngOnInit();
        } else {
          console.log('Navigation has failed!', e);
        }
      });
    });
  }

  submit() {
    console.log(this.selectForm.value);
    this.getLeaguesData(this.selectForm.value.leaguesList);
  }

}
