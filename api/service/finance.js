const https = require('https');
const moment = require('moment');
const client = require('redis').createClient(process.env.REDIS_URL);
const FETCH_INTERVAL = 30000;
const API_REQUEST_ERROR_MESSAGE = 'How unfortunate! The API Request Failed';

class Finance {
    constructor() {}
    getIndicator(socket, stocks) {

        if (Math.random(0, 1) < 0.1) {
            throw new Error(API_REQUEST_ERROR_MESSAGE);
        }
        const path = '/finance/info?client=ig&q=' + stocks;
        https.get({
            port: 443,
            method: 'GET',
            hostname: 'www.google.com',
            path: path,
            timeout: 1000
        }, response => {
            console.log('called ', path);

            response.setEncoding('utf8');
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                if (data.length > 0) {
                    let dataObj;
                    try {
                        dataObj = JSON.parse(data.substring(3));
                    } catch (e) {
                        return false;
                    }

                    let items = [];
                    let lastTradeDate;
                    let lastTradeTS;
                    let item;
                    let stock;

                    dataObj.forEach(d => {
                        lastTradeTS = Date.parse(d.lt_dts);
                        lastTradeDate = new Date(lastTradeTS);
                        stock = d.t;

                        item = {
                            ticker: d.t,
                            name: d.e + '/' + d.t,
                            exchange: d.e,
                            valor: parseFloat(d.l_cur),
                            change: d.c,
                            changePercent: d.cp,
                            lastTradeTime: d.lt,
                            lastTradeDate: lastTradeDate
                        };

                        items.push(item);

                        client.set(stock + ':' + lastTradeTS, JSON.stringify(item), (err, response) => {
                            if (err) {
                                console.error(err);
                            }
                            console.log(response);
                        });
                    });

                    socket.emit('fetch-stocks', items);
                }
            });
        });
    }

    trackIndicator(socket, stocks) {
        this.tryIndicator(socket, stocks);
        const timer = setInterval(() => {
            this.tryIndicator(socket, stocks);
        }, FETCH_INTERVAL);

        socket.on('disconnect', () => {
            clearInterval(timer);
        });
    }

    tryIndicator(socket, stocks) {
        try {
            this.getIndicator(socket, stocks);
        } catch (e) {
            if (e.message === API_REQUEST_ERROR_MESSAGE) {
                console.error('Reintentar!')
                this.tryIndicator(socket, stocks);
            } else {
                throw new Error('¡Ups! Esto es el acabose, cerrando por fuera.')
            }
        }
    }

    getHistorical(socket, stock) {
        client.keys(stock + ':*', (err, keys) => {
            console.log('keys:', keys);
            if (err || keys === null) {
                console.error(err);
                keys = [];
            }
            this.iterateHistoricalKeys(socket, keys);
        });

    }

    iterateHistoricalKeys(socket, keys) {
        let items = [];
        let item = {};
        client.mget(keys, (err, rows) => {
            rows.forEach(row => {
                item = JSON.parse(row);
                item.engTradeDate = moment.utc(item.lastTradeDate).format("YYYY-MM-DD HH:mm:ss");
                items.push(item);
            });

            socket.emit('fetch-historical', items);
        });
    }
}

module.exports = new Finance();
