import express from 'express';
import http from 'http';
import WebSocket from 'ws';

// have express run on the http server
const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

// setup websocket on the same server (websocket has a different protocol then http so there is no conflict)
const wss = new WebSocket.Server({ server: server});

// setup ws events
wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        console.log("recieved: %s", msg);
    });

    ws.send("hello client");
})

server.listen(4000, () => {
    console.log('express-server listening on: 127.0.0.1:4000');
});
