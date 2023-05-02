const ExchangeServer = require('./lib/exchangeserver.js');
const ExchangeClient = require('./lib/exchangeclient.js');

const port1 = 1024 + Math.floor(Math.random() * 1000);
const server1 = new ExchangeServer(port1);
const client1 = new ExchangeClient();