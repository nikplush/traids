import { Injectable } from '@angular/core';

export interface TradeData {
  entry_date: string,
  exit_date: string,
  start_price: number,
  end_price: number,
  profit: number
}

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  trades: TradeData[] = []
  balance: number = 0

  private countBalance () {
    let sum: number = 0
    this.trades.forEach(item => sum += item.profit )
    this.balance = sum
  }

  private getPermissibleProfit (index: number) {
    let count: number = this.balance
    for(let i = index; i < this.trades.length; i++){
      if (count < this.trades[i].profit) {
        count = this.trades[i].profit
      }
    }
    return count
  }

  public getTrade (index: number) {
    const permissibleProfit =  this.getPermissibleProfit(index)
    return {trade:this.trades[index], permissibleProfit }
  }

  addItem (newTrade: TradeData) {
    this.trades.push(newTrade)
    this.countBalance()
  }

  constructor() { }
}
