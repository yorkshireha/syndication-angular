import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html'
})
export class VenuesComponent implements OnInit {
  selectForm;
  venuesList;
  venueData;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectForm = this.formBuilder.group({
      venuesList: ['']
    });

    this.getVenuesList();
  }

  ngOnInit() {
    console.log(this.route.snapshot.params);

    if (this.route.snapshot.params.venue) {
      console.log(this.route.snapshot.params.venue);
      this.getVenueData();
    }
    this.onChanges();
  }

  getVenuesList() {
    this.apiService.getVenuesList()
      .subscribe((data) => {
        console.log(data);
        this.venuesList = data;
        }, err => {
          console.log(err);
        }
      );
  }

  getVenueData() {
    this.apiService.getVenue(this.route.snapshot.params.venue)
      .subscribe((data: any) => {
        console.log('', data);
        this.venueData = data;
        }, err => {
          console.log(err);
        }
      );
  }

  onChanges(): void {
    this.selectForm.valueChanges.subscribe(values => {
      console.log(values, this.route);
      this.router.navigate(['venues', {venue: values.venuesList}]).then( e => {
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
