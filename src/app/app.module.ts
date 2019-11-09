import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LeagueTablesComponent } from './league-tables/league-tables.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { ClubsComponent } from './clubs/clubs.component';
import { VenuesComponent } from './venues/venues.component';

import { LeagueSelectComponent } from './controls/league-select/league-select.component';

@NgModule({
  declarations: [
    AppComponent,
    /* Main view components */
    DashboardComponent,
    LeagueTablesComponent,
    FixturesComponent,
    ClubsComponent,
    VenuesComponent,
    /* Controls */
    LeagueSelectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
