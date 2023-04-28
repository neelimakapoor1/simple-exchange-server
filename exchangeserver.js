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

	const peer = new PeerRPCServer(link, {});
	peer.init();

	const service = peer.transport('server');
	service.listen(port);

	setInterval(() => {
	  link.announce('exchange_worker', service.port, {});
	}, 1000);

	service.on('request', (rid, key, order, handler) => {
	  console.log(`Order ${order.id} received at server`, service.port,  order);
	   try {
			  this.orderbook.addOrder(order);
			  while(this.orderbook.matchOrders());
			  handler.reply(null, `Added order ${order.id} and matched at ${service.port}`);
			}
			catch(e){
			  handler.reply('Receive order error ' + e.message);
			}
		});
  }
}
