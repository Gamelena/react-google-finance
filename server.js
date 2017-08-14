const path = require('path');
const express = require('express');
const http = require('http');
const finance = require('./api/service/finance');
const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = require('socket.io').listen(server,  { path: '/socket.io' });


const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

// Workaround para usar webpack hot reloading con socket.io, no disponible al usar webpack-dev-server.
if (process.env.NODE_ENV !== 'production') {
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
    }));
    app.use(require('webpack-hot-middleware')(compiler));
}
// /Workaround

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

io.set('origins', '*:*');

io.sockets.on('connection', socket => {
    console.log('connected');
    socket.on('req-stocks', data => {
        console.log('req-stocks', data);
        finance.trackIndicator(socket, data.stocks);
    });
    socket.on('req-historical', data => {
        console.log('req-historical', data);
        finance.getHistorical(socket, data.stock);
    });
});

server.listen(PORT, error => {
    error
        ? console.error(error)
        : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});



