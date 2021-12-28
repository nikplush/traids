import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TradesComponent} from "./trades/trades.component";
import {ChartsComponent} from "./charts/charts.component";

const routes: Routes = [
  { path: 'treads', component: TradesComponent },
  { path: 'chart', component: ChartsComponent },
  { path: '**', redirectTo: '/treads'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
