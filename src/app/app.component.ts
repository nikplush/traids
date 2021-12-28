import { Component } from '@angular/core';
import {TradeService} from "./trade.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private readonly tradeService: TradeService,) {}
  title = 'trades';
  isDisableCharts: boolean = !this.tradeService.trades.length
}
