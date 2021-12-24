import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TradeData} from "../trades/trades.component";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  buyTicketForm: FormGroup = new FormGroup({
    entry_date: new FormControl(this.data.entry_date),
    exit_date: new FormControl(this.data.exit_date),
    start_price: new FormControl(this.data.start_price),
    end_price: new FormControl(this.data.end_price),
    profit: new FormControl(this.data.profit),
    })

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeData,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log('LOOG', this.data)
  }
}
