const ExchangeServer = require('./lib/exchangeserver.js');
const ExchangeClient = require('./lib/exchangeclient.js');

const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));

async function init(){
    const port = 1024 + Math.floor(Math.random() * 1000);
    const grapeUrl =  'http://' + process.argv[2] + ':' + process.argv[3];
    const server = new ExchangeServer(port, grapeUrl);
    const client = new ExchangeClient(grapeUrl);

    console.log('Worker port', port);
    console.log('Grape URL', grapeUrl);
}

init();