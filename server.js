const path = require('path');
const express = require('express');
const http = require('http');
const finance = require('./api/service/finance');
const redis = require("redis").createClient();
const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = require('socket.io').listen(server,  { path: '/socket.io' });

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

io.set('origins', '*:*');

io.sockets.on('connection', socket => {
    console.log('connected');
    socket.on('indicator', data => {
        console.log(data);
        finance.trackIndicator(socket, data.indicator);
    });
});

server.listen(PORT, error => {
    error
        ? console.error(error)
        : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});



