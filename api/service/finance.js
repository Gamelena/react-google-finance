const https = require('https');

exports.finance = function () {
    const FETCH_INTERVAL = 5000;
    const PRETTY_PRINT_JSON = true;

    this.trackIndicator = (socket, indicator => {
        getIndicator(socket, indicator);

        var timer = setInterval(function() {
            getIndicator(socket, indicator);
        }, FETCH_INTERVAL);

        socket.on('disconnect', () => {
            clearInterval(timer);
        });
    });

    this.test = function () {
        console.log("test");
    };

    const getIndicator = (socket, indicator => {
        https.get({
            port: 443,
            method: 'GET',
            hostname: 'www.google.com',
            path: '/finance/info?client=ig&q=' + indicator,
            timeout: 1000
        }, function(response) {
            if (Math.rand(0, 1) < 0.1) {
                throw new Error('How unfortunate! The API Request Failed');
            }

            response.setEncoding('utf8');
            let data = '';

            response.on('data', function(chunk) {
                data += chunk;
            });

            response.on('end', function() {
                if (data.length > 0) {
                    let dataObj;

                    try {
                        dataObj = JSON.parse(data.substring(3));
                    } catch (e) {
                        return false;
                    }

                    let quote = {};
                    quote.ticker = dataObj[0].t;
                    quote.exchange = dataObj[0].e;
                    quote.price = dataObj[0].l_cur;
                    quote.change = dataObj[0].c;
                    quote.change_percent = dataObj[0].cp;
                    quote.last_trade_time = dataObj[0].lt;
                    quote.dividend = dataObj[0].div;
                    quote.yield = dataObj[0].yld;

                    socket.emit(indicator, PRETTY_PRINT_JSON ? JSON.stringify(quote, null, 4) : JSON.stringify(quote));
                }
            });
        });
    });
};
