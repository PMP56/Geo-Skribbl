const http = require('http');
const path = require('path');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

var rooms = {};

io.on('connection', (socket) => {
    //console.log('A user connected');
    socket.emit('message', 'Welcome to Geo Skribbl');
    socket.broadcast.emit('message', 'Someone joined the chat');

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    socket.on('chat', (chat) => {
        io.emit('chat', chat);
    });

    socket.on('clear', () => {
        io.emit('clear');
    });

    socket.on('mouseDown', (data) => {
        io.emit('mouseDown', data);
    });
    socket.on('mouseMove', (data) => {
        io.emit('mouseMove', data);
    });
    socket.on('mouseUp', () => {
        io.emit('mouseUp');
    });

    socket.on('join', ({ code, user }) => {
        socket.join(code);
        //let room = io.sockets.adapter.rooms[code];
        //let sockets = room['sockets']
        if (!(code in rooms)) {
            rooms[code] = { owner: user, code: code, members: [user] };
        } else {

            rooms[code]['members'].push(user);
        }
        io.emit('join', rooms[code])
        //console.log(room, socket.username);
    })
})

app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`App started in port: ${PORT}`)
});