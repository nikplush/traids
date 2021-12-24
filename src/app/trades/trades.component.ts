import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";

export interface DialogData {
  animal: string;
  name: string;
}

export interface TradeData {
  entry_date: string,
  exit_date: string,
  start_price: number,
  end_price: number,
  profit: number
}

@Component({
  selector: 'app-trades',
  templateUrl: 'trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const initValues: TradeData = {
      entry_date: '',
      exit_date: '',
      start_price: 0,
      end_price: 0,
      profit: 0
    }

    this.dialog.open(DialogComponent, {
      width: '33%',
      data: initValues,
    });
  }

  ngOnInit(): void {
  }

}
