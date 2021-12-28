import { Component } from '@angular/core';
import {TradeData, TradeService} from "./trade.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private readonly tradeService: TradeService,) {}
  title = 'trades';
  trade: TradeData[] = this.tradeService.trades
  isDisableCharts: boolean = !this.trade.length
}
