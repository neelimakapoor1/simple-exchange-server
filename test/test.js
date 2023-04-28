const assert = require('chai').expect;
const expect = require('chai').expect;
const ExchangeServer = require('./../exchangeserver.js');
const ExchangeClient = require('./../exchangeclient.js');

const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));

describe ('Add dummy orders', ()=>{
	before(()=>{
		console.log('Before');
	})
	after(()=>{
		console.log('After');
	})

	describe('Test1',()=>{
		beforeEach(()=>{

		})

		it('Submit dummy orders', async()=>{
			const port1 = 1024 + Math.floor(Math.random() * 1000);
			const server1 = new ExchangeServer(port1);
			const port2 = 1024 + Math.floor(Math.random() * 1000);
			const server2 = new ExchangeServer(port2);
			const client1 = new ExchangeClient();
			const client2 = new ExchangeClient();

			console.log('client1');
			await delay(3000);
			await client1.submitOrder('buy', 20000, 1);
			await delay(1000);
			await client1.submitOrder('sell', 29000, 0.8);
			await delay(1000);
			await client1.submitOrder('buy', 26000, 0.5);
			await delay(1000);
			await client1.submitOrder('sell', 29500, 0.1);
			await delay(1000);
			await client1.submitOrder('buy', 28700, 0.2);

			console.log('client2');
			await delay(1000);
			await client2.submitOrder('sell', 29800, 0.45);
			await delay(1000);
			await client2.submitOrder('sell', 27000, 0.81);
			await delay(1000);
			await client2.submitOrder('buy', 30000, 0.52);
			
		})
	})
});