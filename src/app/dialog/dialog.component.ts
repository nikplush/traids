import {Subscription} from "rxjs";
import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {TradeData} from "../trades/trades.component";
import {TradeService} from "../trade.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnDestroy {
  tradeForm: FormGroup = new FormGroup({
    entry_date: new FormControl(this.data.entry_date, Validators.required),
    exit_date: new FormControl(this.data.exit_date, Validators.required),
    start_price: new FormControl(this.data.start_price, Validators.required),
    end_price: new FormControl(this.data.end_price, Validators.required),
    profit: new FormControl(this.data.profit, [this.profitValidator(),Validators.required],),
  }, [this.dateRangeValidator()])
  subscriptions: Subscription[];

  constructor(public readonly dialogRef: MatDialogRef<DialogComponent>,
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
    this.dialogRef.close({ trade: this.tradeForm.value });
  }

  changeTrade(): void {
    if (( this.data.index !== undefined)  && this.tradeForm.valid) {
      this.dialogRef.close({ trade: this.tradeForm.value, index: this.data.index });
    }
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
