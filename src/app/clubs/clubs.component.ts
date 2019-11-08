import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html'
})
export class ClubsComponent implements OnInit {
  selectForm;
  clubsList;
  clubData;

  constructor(
    private formBuilder: FormBuilder,
    private leagueService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectForm = this.formBuilder.group({
      clubsList: ['']
    });

    this.getClubsList();
  }

  ngOnInit() {
    console.log(this.route.snapshot.params);

    if (this.route.snapshot.params.club) {
      console.log(this.route.snapshot.params.club);
      this.getClubData();
    }
    this.onChanges();
  }

  getClubsList() {
    this.leagueService.getClubsList()
      .subscribe((data) => {
        console.log(data);
        this.clubsList = data;
        }, err => {
          console.log(err);
        }
      );
  }

  getClubData() {
    this.leagueService.getClub(this.route.snapshot.params.club)
      .subscribe((data: any) => {
        console.log('', data);
        this.clubData = data;
        }, err => {
          console.log(err);
        }
      );
  }

  onChanges(): void {
    this.selectForm.valueChanges.subscribe(values => {
      console.log(values, this.route);
      this.router.navigate(['clubs', {club: values.clubsList}]).then( e => {
        if (e) {
          console.log('Navigation is successful!', e);
          this.ngOnInit();
        } else {
          console.log('Navigation has failed!', e);
        }
      });
    });
  }

}
