const { PeerRPCServer } = require('grenache-nodejs-ws');
const Link = require('grenache-nodejs-link');
const OrderBook = require('./orderbook.js');

module.exports = class ExchangeServer {
  constructor(port, orderbook) {
  	this.orderbook = new OrderBook();

    const link = new Link({
		  grape: 'http://127.0.0.1:30001'
		})
		link.start();

	this.peer = new PeerRPCServer(link, {});
	this.peer.init();

	this.service = this.peer.transport('server');
	this.service.listen(port);

	setInterval(() => {
	  link.announce('exchange_worker', this.service.port, {});
	}, 1000);

	this.service.on('request', (rid, key, order, handler) => {
	  console.log(`Order ${order.id} received at server`, this.service.port,  order);
	   try {
			  this.orderbook.addOrder(order);
			  while(this.orderbook.matchOrders());
			  handler.reply(null, `Added order ${order.id} and matched at ${this.service.port}`);
			}
			catch(e){
			  handler.reply('Receive order error ' + e.message);
			}
		});
  }

 	getOrderBook(){
 		return this.orderbook;
 	}

 	stop(){
 		this.service._stop();
 	}
}
