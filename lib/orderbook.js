const {Heap} = require('heap-js');

module.exports = class OrderBook {
  constructor() {
    this.bids = new Heap((a, b) => b.price - a.price);
    this.asks = new Heap((a, b) => a.price - b.price);
  }

  addOrder(order) {
    console.log('Adding order', order);
    if (order.type === 'buy') {
      this.bids.push(order);
    } else if (order.type === 'sell') {
      this.asks.push(order);
    }
    return true;
  }

  matchOrders() {
    while (this.bids.size() > 0 && this.asks.size() > 0) {
      const bestBid = this.bids.peek();
      const bestAsk = this.asks.peek();
      console.log('Best bid', bestBid);
      console.log('Best ask', bestAsk);

      if (bestBid.price >= bestAsk.price) {
        // Request execute trade with matched amount
        const amount = Math.min(bestBid.amount, bestAsk.amount);
        this.onOrderMatch({
          bidId: bestBid.id,
          askId: bestAsk.id,
          price: bestAsk.price,
          amount: amount
        });

        // Update the bid order
        bestBid.amount = Number((bestBid.amount - amount).toFixed(2))
        if (bestBid.amount === 0) {
          this.bids.pop();
        }

        // Update the ask order
        bestAsk.amount = Number((bestAsk.amount - amount).toFixed(2))
        if (bestAsk.amount === 0) {
          this.asks.pop();
        } 
      } else {
        console.log('No match found as best bid is less than best ask')
        break;
      }
    }
  }

  onOrderMatch(trade){
    // TODO: Execute-trade. This should only take place once
    console.log('Matched order',trade);
  }

  print(){
    console.log('BIDS', this.bids.toArray());
    console.log('================================================');
    console.log('ASKS', this.asks.toArray());
  }
}