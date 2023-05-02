const assert = require('chai').assert;
const expect = require('chai').expect;
const ExchangeServer = require('./../lib/exchangeserver.js');
const ExchangeClient = require('./../lib/exchangeclient.js');
const OrderBook = require('./../lib/orderbook.js');

const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));

describe ('OrderBook testing', ()=>{
	let client1 = null, client2 = null, server1 = null, server2 = null;
	before(async()=>{
		const port1 = 1024 + Math.floor(Math.random() * 1000);
		server1 = new ExchangeServer(port1);
		const port2 = 1024 + Math.floor(Math.random() * 1000);
		server2 = new ExchangeServer(port2);
		client1 = new ExchangeClient();
		client2 = new ExchangeClient();

		console.log('Submit orders on client1');
		await delay(3000);
		await client1.submitOrder('buy', 20000, 0.5);
		await delay(1000);
		await client1.submitOrder('sell', 25000, 0.8);
		await delay(1000);
		await client1.submitOrder('buy', 26000, 0.5);
		await delay(1000);
		await client1.submitOrder('sell', 29500, 0.1);
		await delay(1000);
		await client1.submitOrder('buy', 28700, 0.2);

		console.log('Submit orders on client2');
		await delay(1000);
		await client2.submitOrder('sell', 29800, 0.45);
		await delay(1000);
		await client1.submitOrder('buy', 24000, 0.55);
		await delay(1000);
		await client2.submitOrder('sell', 27000, 0.81);
		await delay(1000);
		await client2.submitOrder('buy', 30000, 0.52);

		console.log('Printing left over orders');
		server1.getOrderBook().print();
	})
	after(async()=>{
		console.log('Unlistening on servers');
		server1.stop();
		server2.stop();
	})

	describe('Add dummy orders and verify',()=>{
		beforeEach(async()=>{
		})

		afterEach(async()=>{
			
		})

		it('Compare orders on both servers', ()=>{
			compareOrders(server1.getOrderBook().bids.toArray(), server2.getOrderBook().bids.toArray());
			compareOrders(server1.getOrderBook().asks.toArray(), server2.getOrderBook().asks.toArray());
		})

		it('Verify leftover orders', ()=>{
			const expectedBids = [ 
				{ type: 'buy', price: 24000, amount: 0.55 },
  				{ type: 'buy', price: 20000, amount: 0.5 }
			];
			const expectedAsks = [
			  { type: 'sell', price: 27000, amount: 0.39 },
			  { type: 'sell', price: 29500, amount: 0.1 },
			  { type: 'sell', price: 29800, amount: 0.45 }
			];
			compareOrders(server1.getOrderBook().bids.toArray(), expectedBids);
			compareOrders(server1.getOrderBook().asks.toArray(), expectedAsks);
		})

		function compareOrders(orderList1, orderList2){
			expect(orderList1.length).to.eq(orderList2.length);
			for (var i = 0; i < orderList1.length; i++) {
				let order1 = orderList1[i];
				let order2 = orderList2[i];
				expect(order1.type).to.eq(order2.type);
				expect(order1.price).to.eq(order2.price);
				expect(order1.amount).to.eq(order2.amount);
			}
		}
	})
});