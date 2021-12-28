import {Injectable} from '@angular/core';
import {EChartsOption} from "echarts";

export interface TradeData {
  entry_date: string;
  exit_date: string;
  start_price: number;
  end_price: number;
  profit: number;
  balance: number;
}

export interface SelectedTrade {
  trade: TradeData;
  permissibleProfit: number
}

@Injectable({
  providedIn: 'root'
})
export class TradeService{
  trades: TradeData[] = [];
  balance: number = 0;

  private countBalance():void{
    let sum: number = 0;
    this.trades = this.trades.map(item => {
      sum += item.profit
      return {...item, balance: sum}
    } );
  }

  private getPermissibleProfit( index: number ):number {
    let count: number = this.trades[index].balance;
    for(let i = index; i < this.trades.length; i++){
      if (this.trades[i].balance < count ) {
        count = this.trades[i].balance;
      }
    }
    return count;
  }

  public getTrade( index: number ):SelectedTrade {
    const permissibleProfit =  this.getPermissibleProfit(index);
    return {trade:this.trades[index], permissibleProfit };
  }

  public updateTrade( trade: TradeData, index: number, ):void{
    this.trades[index] = trade;
    this.countBalance()
  }

  public addItem( newTrade: TradeData ):void {
    const transformData = {...newTrade, balance: this.balance + newTrade.profit};
    this.trades.push(transformData);
    this.balance += newTrade.profit;
  }

  public generateConfig(dates:string[], values:number[]):EChartsOption {
    return {
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: values,
          type: 'line',
        },
      ],
    };
  }

  constructor() { }
}
