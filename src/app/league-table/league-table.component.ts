import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { LeagueService } from '../league.service';

@Component({
  selector: 'league-table',
  templateUrl: './league-table.component.html'
})
export class LeagueTableComponent implements OnInit {
  selectForm: FormGroup;
  leaguesList;
  gotData: boolean = false;
  league;
  divisions;
  team;

  constructor(private leagueService: LeagueService, private formBuilder: FormBuilder) {
    this.selectForm = this.formBuilder.group({
      leaguesList: ['']
    });
    
    this.getLeaguesList();
  }

  ngOnInit() {
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
      .subscribe((data) => {
        console.log('', data);
        this.league = data['league'];
        this.gotData = true;
        console.log('league', this.league);
        console.log('division', data['league']['divisions']);
        console.log('team', data['league']['divisions'][0]['teams'][0]);
        }, err => {
          console.log(err);
        }
      );
  }

	onChanges(): void {
	  this.selectForm.valueChanges.subscribe(values => {
	    console.log(values);
    this.getLeaguesData(values.leaguesList);
	  });
	}

  submit() {
    console.log(this.selectForm.value);
    this.getLeaguesData(this.selectForm.value.leaguesList);
  }

}
