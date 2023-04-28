const ExchangeServer = require('./exchangeserver.js');
const ExchangeClient = require('./exchangeclient.js');

const port1 = 1024 + Math.floor(Math.random() * 1000);
const server1 = new ExchangeServer(port1);
const port2 = 1024 + Math.floor(Math.random() * 1000);
const server2 = new ExchangeServer(port2);
const client1 = new ExchangeClient();
const client2 = new ExchangeClient();