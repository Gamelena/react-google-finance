const https = require('https');
const moment = require('moment');
const FETCH_INTERVAL = 5000;
const PRETTY_PRINT_JSON = true;
const API_REQUEST_ERROR_MESSAGE = 'How unfortunate! The API Request Failed';

class Finance {
    constructor() {}
    getIndicator(socket, indicator) {

        if (Math.random(0, 1) < 0.1) {
            throw new Error(API_REQUEST_ERROR_MESSAGE);
        }
        const path = '/finance/info?client=ig&q=' + indicator;
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

                    let quotes = [];
                    let dateTs;
                    let lastTradeDate;
                    let ltTS;
                    let dateTimeLT;

                    dataObj.forEach(d => {
                        ltTS = Date.parse(d.lt_dts);
                        dateTimeLT = new Date(ltTS);

                        quotes.push({
                            ticker: d.t,
                            name: d.e + '/' + d.t,
                            exchange: d.e,
                            valor: parseFloat(d.l_cur),
                            change: d.c,
                            changePercent: d.cp,
                            lastTradeTime: d.lt,
                            lastTradeDate: lastTradeDate,
                            dividend: d.div,
                            yield: d.yld
                        });
                    });

                    socket.emit('fetch-indicators', PRETTY_PRINT_JSON ? JSON.stringify(quotes, null, 4) : JSON.stringify(quotes));
                }
            });
        });
    }

    trackIndicator(socket, indicator) {
        this.tryIndicator(socket, indicator);
        const timer = setInterval(() => {
            this.tryIndicator(socket, indicator);
        }, FETCH_INTERVAL);

        socket.on('disconnect', () => {
            clearInterval(timer);
        });
    }

    tryIndicator(socket, indicator) {
        try {
            this.getIndicator(socket, indicator);
        } catch (e) {
            if (e.message === API_REQUEST_ERROR_MESSAGE) {
                console.error('Reintentar!')
                this.tryIndicator(socket, indicator);
            } else {
                throw new Error('¡Ups! Esto es el acabose, cerrando por fuera.')
            }
        }
    }
}

module.exports = new Finance();
