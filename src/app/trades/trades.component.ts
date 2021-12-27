import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {TradeService} from "../trade.service";

export interface TradeData {
  entry_date: string,
  exit_date: string,
  start_price: number,
  end_price: number,
  profit: number
  permissibleProfit: number
  index?: number
}

@Component({
  selector: 'app-trades',
  templateUrl: 'trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private tradeService: TradeService
  ) {
  }

  trades = this.tradeService.trades;

  openNewTread(): void {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    const initValues: TradeData = {
      entry_date: today.toISOString().split('T')[0],
      exit_date: tomorrow.toISOString().split('T')[0],
      start_price: 0,
      end_price: 0,
      profit: 0,
      permissibleProfit: this.tradeService.balance,
    }

    this.dialog.open(DialogComponent, {
      width: '33%',
      data: initValues,
    });
  }

  openTread(index: number): void {
    const {trade, permissibleProfit} = this.tradeService.getTrade(index);
    this.dialog.open(DialogComponent, {
      width: '33%',
      data: {...trade, permissibleProfit, isNew: false, index},
    });
  }

  ngOnInit(): void {

  }

}
