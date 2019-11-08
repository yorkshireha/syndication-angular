import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LeagueTableComponent } from './league-table/league-table.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { ClubsComponent } from './clubs/clubs.component';
import { VenuesComponent } from './venues/venues.component';

const routes: Routes = [
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'tables',     component: LeagueTableComponent },
  { path: 'tables/:id', component: LeagueTableComponent },
  { path: 'fixtures',   component: FixturesComponent },
  { path: 'clubs',      component: ClubsComponent },
  { path: 'clubs/:id',  component: ClubsComponent },
  { path: 'venues',     component: VenuesComponent },
  { path: 'venues/:id', component: VenuesComponent },
  { path: '',           redirectTo: '/dashboard', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
