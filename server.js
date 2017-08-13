const path = require('path');
const express = require('express');
const http = require('http');
const finance = require('./api/service/finance');
// const redis = require("redis").createClient();

let io = require('socket.io');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));


app.get('/indicator', (req, res) => {
    res.send('WIII');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});



const server = http.createServer(app);
io = io.listen(server);
io.set('origins', '*:*');

io.sockets.on('connection', socket => {
    socket.on('indicator', indicator => {
        finance.trackIndicator(socket, indicator);
    });
});


server.listen(PORT, error => {
    error
        ? console.error(error)
        : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});



