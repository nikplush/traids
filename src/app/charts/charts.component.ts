import {Component, OnInit} from '@angular/core';
import {EChartsOption} from "echarts";
import {TradeData, TradeService} from "../trade.service";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor(private readonly tradeService: TradeService) {
  }
  treads: TradeData[] = this.tradeService.trades
  dates: string[] = [];
  values: number[] = [];
  sums: number[] = [];
  chartOfProfitOption: EChartsOption = this.tradeService.generateConfig(this.dates, this.values)
  chartOfSumOption: EChartsOption = this.tradeService.generateConfig(this.dates, this.sums)

  private sortAndConcat(): TradeData[] {
    let transformedTrades: TradeData[] = []
    const addedDates: string[] = []
    this.treads.forEach(tread => {
        if (!addedDates.includes(tread.exit_date)) {
          const sameDataTrades = this.treads.filter(item => tread.exit_date === item.exit_date)
          addedDates.push(tread.exit_date)
          if (sameDataTrades.length) {
            const newTread = {...tread, profit: 0}
            sameDataTrades.forEach(item => newTread.profit += item.profit)
            transformedTrades.push(newTread)
          }
        }
      }
    )
    transformedTrades.sort((a:TradeData,b:TradeData) =>
      new Date(a.exit_date).getTime() - new Date(b.exit_date).getTime()
    );

    return transformedTrades;
  }

  ngOnInit(): void {
    const transformedData: TradeData[] = this.sortAndConcat()
    let sum: number = 0;
    transformedData.forEach(item => {
      this.dates.push(item.exit_date);
      this.values.push(item.profit);
      sum += item.profit;
      this.sums.push(sum);
    })
  }


}
