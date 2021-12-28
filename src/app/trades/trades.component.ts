import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {TradeService} from "../trade.service";

export interface TradeData {
  entry_date: string;
  exit_date: string;
  start_price: number;
  end_price: number;
  profit: number;
  permissibleProfit: number;
  index?: number;
  balance?: number;
}

@Component({
  selector: 'app-trades',
  templateUrl: 'trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent {
  constructor(
    private readonly tradeService: TradeService,
    public readonly dialog: MatDialog,
  ) {
  }

  trades = this.tradeService.trades;

  openAddTreadDialog(): void {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const initValues: TradeData = {
      entry_date: this.convertingDateToString(today),
      exit_date: this.convertingDateToString(tomorrow),
      start_price: 0,
      end_price: 0,
      profit: 0,
      permissibleProfit: this.tradeService.balance,
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '33%',
      data: initValues,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tradeService.addItem(result.trade);
      }
    })
  }

  openTreadDialog(index: number): void {
    const {trade, permissibleProfit} = this.tradeService.getTrade(index);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '33%',
      data: {...trade, permissibleProfit, index},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const {trade, index} = result
        this.tradeService.updateTrade(trade, index);
      }
    })
  }


  convertingDateToString(date: Date): string {
    return date.toISOString().split('T')[0]
  }

}
