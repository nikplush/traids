import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TradeData} from "../trades/trades.component";
import {AbstractControl, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {TradeService} from "../trade.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {
  tradeForm: FormGroup = new FormGroup({
    entry_date: new FormControl(this.data.entry_date),
    exit_date: new FormControl(this.data.exit_date),
    start_price: new FormControl(this.data.start_price),
    end_price: new FormControl(this.data.end_price),
    profit: new FormControl(this.data.profit, [this.profitValidator()]),
  }, [this.dateRangeValidator()])
  subscriptions: Subscription[];

  constructor(
    private readonly tradeService: TradeService,
    public readonly dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeData,
  ) {


    this.subscriptions = [
      this.tradeForm.get('start_price')!.valueChanges.subscribe(
        value => {
          const end_price = this.tradeForm.get('end_price')?.value;
          this.tradeForm.patchValue({profit: (end_price - value)});
        }),
      this.tradeForm.get('end_price')!.valueChanges.subscribe(value => {
        const start_price = this.tradeForm.get('start_price')?.value;
        this.tradeForm.patchValue({profit: (value - start_price)});
      }),

    ]
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveTrade(): void {
    if (this.tradeForm.invalid) {
      return;
    }
    this.tradeService.addItem(this.tradeForm.value);
    this.dialogRef.close();
  }

  changeTrade(): void {
    if ((this.data.index || this.data.index === 0)  && this.tradeForm.valid) {
      this.tradeService.updateTrade(this.data.index, this.tradeForm.value);
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  dateRangeValidator(): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const formGroup = abstractControl as FormGroup;
      const startDate = formGroup.controls.entry_date;
      const exitDate = formGroup.controls.exit_date;
      const transformedStartDate = new Date(startDate?.value).getTime();
      const transformedEndDate = new Date(exitDate?.value).getTime();
      if (transformedStartDate >= transformedEndDate) {
        return {'invalidDateRange': true};
      }
      return null;
    }
  }

  profitValidator(): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const value = abstractControl.value;
      const a = value - this.data.profit;
      if (a < 0 && -a > this.data.permissibleProfit) {
        return {'shouldBePositive': true};
      }
      return null;
    }
  }
}
