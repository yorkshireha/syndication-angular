import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-league-select',
  templateUrl: './league-select.component.html'
})
export class LeagueSelectComponent implements OnInit {
  @Output() leagueChanged = new EventEmitter<object>();
  @Output() formLoaded = new EventEmitter<object>();
  leagueForm: FormGroup;
  leaguesList;
  leagueId;

  @Input()
  set selectedLeague(leagueId: string) {
    this.leagueId = leagueId || '';
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.getLeaguesList();
  }

  ngOnInit() {
    this.leagueForm = this.formBuilder.group({
      leaguesList: [this.leagueId]
    });

    this.onLeagueChanges();
  }

  onLeagueChanges(): void {
    this.leagueForm.valueChanges.subscribe(values => {
      this.leagueChanged.emit({
        leagueId: values.leaguesList
      });
    });
  }

  getLeaguesList() {
    this.apiService.getLeaguesList().subscribe((data) => {
      this.leaguesList = data;
      this.formLoaded.emit();
    }, err => {
      console.log(err);
    });
  }

}
