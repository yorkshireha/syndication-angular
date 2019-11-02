import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { LeagueService } from '../league.service';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html'
})
export class FixturesComponent implements OnInit {
  selectForm: FormGroup;
  leaguesList;
  gotData: boolean = false;
  fixtures;

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
  		this.getFixturesData(this.route.snapshot.params.league);
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

  getFixturesData(id) {
    this.leagueService.getFixtures(id)
      .subscribe((data) => {
        console.log('', data);
        this.fixtures = data;
        console.log('team', this.fixture);
        this.gotData = true;
        }, err => {
          console.log(err);
        }
      );
  }

	onChanges(): void {
	  this.selectForm.valueChanges.subscribe(values => {
	    console.log(values, this.route);
    	this.router.navigate(['fixtures', {league: values.leaguesList}]).then( e => {
	      if (e) {
	        console.log("Navigation is successful!", e);
	        this.ngOnInit();
	      } else {
	        console.log("Navigation has failed!", e);
	      }
    	});
	  });
	}

  submit() {
    console.log(this.selectForm.value);
    this.getFixturesData(this.selectForm.value.leaguesList);
  }

}
