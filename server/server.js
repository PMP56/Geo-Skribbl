const http = require('http');
const path = require('path');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

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

    socket.on('mouseDown', (data) => {
        io.emit('mouseDown', data);
    });
    socket.on('mouseMove', (data) => {
        io.emit('mouseMove', data);
    });
    socket.on('mouseUp', () => {
        io.emit('mouseUp');
    });
})

app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`App started in port: ${PORT}`)
});