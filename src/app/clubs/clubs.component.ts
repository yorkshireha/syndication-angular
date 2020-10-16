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
  clubId;
  clubsList;
  clubData;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectForm = this.formBuilder.group({
      clubsList: ['']
    });

    this.getClubsList();
  }

  ngOnInit() {
    this.clubId = this.route.snapshot.params.club;
    this.selectForm = this.formBuilder.group({
      clubId: [this.clubId]
    });
    if (this.route.snapshot.params.club) {
      this.getClubData();
    }
    this.onChanges();
  }

  getClubsList() {
    this.apiService.getClubsList().subscribe((data: Array<any>) => {
      this.clubsList = data.filter(el => {
        return el.name != ''
      });
    }, err => {
      console.log(err);
    });
  }

  _crlf2array(astring) {
    return typeof astring === 'string' ? astring.split('\r\n') : astring;
  }

  _comma2array(astring) {
    return typeof astring === 'string' ? astring.split(',') : astring;
  }

  _killBBCodes(astring) {
    return typeof astring === 'string' ? astring.replace(/\[.*\]/g, '') : astring;
  }

  getClubData() {
    this.apiService.getClub(this.route.snapshot.params.club).subscribe((data: any) => {
      // BBCodes
      data.notes = this._killBBCodes(data.notes);

      // JSON
      data.colours = Array.isArray(data.colours) ? data.colours : JSON.parse(data.colours);

      // Commas
      data.email = this._comma2array(data.email);

      // Line endings
      data.teams = this._crlf2array(data.teams);
      data.notes = this._crlf2array(data.notes);

      this.clubData = data;
    }, err => {
       console.log(err);
    });
  }

  onChanges(): void {
    this.selectForm.valueChanges.subscribe(values => {
      this.router.navigate(['clubs', {club: values.clubId}]).then( e => {
        if (e) {
          this.ngOnInit();
        } else {
          console.log('Navigation has failed!', e);
        }
      });
    });
  }

}
