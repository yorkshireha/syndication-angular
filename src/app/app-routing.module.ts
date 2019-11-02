import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LeagueTableComponent } from './league-table/league-table.component';
import { FixturesComponent } from './fixtures/fixtures.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tables', component: LeagueTableComponent },
  { path: 'tables/:id', component: LeagueTableComponent },
  { path: 'fixtures', component: FixturesComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
