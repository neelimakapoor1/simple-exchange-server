const Order = require('./order.js');
const { PeerRPCClient }  = require('grenache-nodejs-ws');
const Link = require('grenache-nodejs-link');

module.exports = class ExchangeClient {
  constructor() {
    const link = new Link({
      grape: 'http://127.0.0.1:30001',
      requestTimeout: 10000
    })
    link.start()

    this.peer = new PeerRPCClient(link, {})
    this.peer.init()
  }

  async submitOrder(type, price, amount) {
    const id = Math.random().toString(36).substring(2, 15);
    const order = new Order(id, type, price, amount);
 
    console.log('New order at client',  order);
    
    //Add order to all workers
    await this.peer.map('exchange_worker', order, { timeout: 10000 }, (err, data) => {
      if (err){
        console.error(err);
        return;
      }
      console.log(data);
    })
  }
}
