const { PeerRPCServer } = require('grenache-nodejs-ws');
const Link = require('grenache-nodejs-link');
const OrderBook = require('./orderbook.js');

module.exports = class ExchangeServer {
  constructor(port, grapeUrl) {
  	this.orderbook = new OrderBook();

    this.link = new Link({
		grape: grapeUrl
	})
	this.link.start();

	this.peer = new PeerRPCServer(this.link, {});
	this.peer.init();

	this.service = this.peer.transport('server');
	this.service.listen(port);

	this.link.announce('exchange_worker', this.service.port, {}, (err) => {
		if (err) throw err
	});

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
		//this.link.stopAnnouncing('exchange_worker', this.service.port);
		this.link.stop();
 		this.service._stop();
 	}
}
