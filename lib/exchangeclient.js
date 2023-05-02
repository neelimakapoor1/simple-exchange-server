const Order = require('./order.js');
const { PeerRPCClient }  = require('grenache-nodejs-ws');
const Link = require('grenache-nodejs-link');
const OrderBook = require('./orderbook.js');

module.exports = class ExchangeClient {
  constructor(grapeUrl) {
    this.orderbook = new OrderBook();
    const link = new Link({
      grape: grapeUrl,
      requestTimeout: 10000
    })
    link.start()

    this.peer = new PeerRPCClient(link, {})
    this.peer.init()
  }

  submitOrder(type, price, amount) {
    const id = Math.random().toString(36).substring(2, 15);
    const order = new Order(id, type, price, amount);
    
    //Add order to all workers
    return new Promise((resolve, reject) => {
      this.peer.map('exchange_worker', order, { timeout: 10000 }, (err, data) => {
        if (err){
          console.error(err);
          reject(err);
          return;
        }
        console.log(data);
        resolve(data);
      })
    })
    
  }
}
