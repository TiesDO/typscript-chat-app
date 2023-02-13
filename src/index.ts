import express from 'express';
import http from 'http';
import WebSocket, { CloseEvent, ErrorEvent, MessageEvent } from 'ws';
import { v4 } from 'uuid';

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server: server});

const SERVER_UUID = "host_server";

interface ClientSocket extends WebSocket {
    uuid: string;
}

interface Client {
    socket: ClientSocket;
    joined: Date;
    uuid: string;
}

interface Message {
    data: string;
    senderID: string;
}

// keep track of all connected clients
let connected: Client[] = [];

wss.on('connection', (ws: ClientSocket) => {
    ws.on('message', (ev: MessageEvent) => {
        BroadcastMessage({
            data: String(ev),
            senderID: ws.uuid,
        }, [ws.uuid]);
    });

    ws.on('error', (ev: ErrorEvent) => {
        console.error(ev.message);
    });

    ws.on('close', (ev: CloseEvent) => {
        DisconnectClient(ws);
    })


    ConnectNew(ws);
})

function ConnectNew(client: ClientSocket) {
    client.uuid = v4();

    connected.push({
        uuid: client.uuid,
        joined: new Date(Date.now()),
        socket: client,
    });

    BroadcastMessage({
        data: `${client.uuid} has joined the server`,
        senderID: SERVER_UUID,
    }, [client.uuid]);
}

function DisconnectClient(client: ClientSocket) {
    BroadcastMessage({
        data: `${client.uuid} has left the server`,
        senderID: SERVER_UUID,
    }, [client.uuid]);

    delete connected[client.uuid];
}

function BroadcastMessage(message: Message, exceptions: string[]) {
    connected.forEach(c => {
        if (exceptions.includes(c.uuid)) { return }
        
        c.socket.send(JSON.stringify(message));
    })
}

server.listen(4000, () => {
    console.log('chat-server listening on: 127.0.0.1:4000');
});
