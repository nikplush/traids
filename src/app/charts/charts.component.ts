import { Component, OnInit } from '@angular/core';
import {EChartsOption} from "echarts";
import {TradeService} from "../trade.service";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor(private tradeService: TradeService) { }
  dates: string[] = []
  values: number[] = []
  sums: number[] = []

  chartOfProfitOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: this.dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.values,
        type: 'line',
      },
    ],
  };

  chartOfSumOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: this.dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.sums,
        type: 'line',
      },
    ],
  };

  ngOnInit(): void {
    let sum: number = 0
    this.tradeService.trades.forEach(item => {
      this.dates.push(item.exit_date)
      this.values.push(item.profit)
      sum += item.profit
      this.sums.push(sum)
    })
  }

}
