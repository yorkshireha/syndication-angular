import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgHttpCachingModule, NgHttpCachingConfig } from 'ng-http-caching';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LeagueTablesComponent } from './league-tables/league-tables.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { ClubsComponent } from './clubs/clubs.component';
import { VenuesComponent } from './venues/venues.component';
import { LeagueSelectComponent } from './controls/league-select/league-select.component';
import { SpinnerComponent } from './spinner/spinner.component';

const ngHttpCachingConfig: NgHttpCachingConfig = {
  lifetime: 1000 * 60 // cache expire after 60 seconds
};

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
    LeagueSelectComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue : ''
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

