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
        //console.log('Disconnect');
    });

    socket.on('chat', (data) => {
        io.in(data.code).emit('chat', data);
    });

    socket.on('clear', () => {
        io.emit('clear');
    });

    socket.on('mouseDown', ({ code, data }) => {
        // var room = io.sockets.adapter.rooms[code];
        // console.log(room);
        //const code = data.code;
        // socket.join(code);
        //console.log(code);
        //console.log(io.sockets.in(data.code));
        io.in(code).emit('mouseDown', data);
    });
    socket.on('mouseMove', ({ code, data }) => {
        //socket.join(code);
        io.in(code).emit('mouseMove', data);
    });
    socket.on('mouseUp', (code) => {
        //socket.join(code);
        io.in(code).emit('mouseUp');
    });

    socket.on('join', ({ code, user }) => {
        socket.join(code);

        if (!(code in rooms)) {
            rooms[code] = { owner: user, code: code, members: [user] };
        } else {
            rooms[code]['members'].push(user);
        }
        io.in(code).emit('join', rooms[code])
    })

    socket.on('canvasJoin', (code) => {
        socket.join(code);
    })

    socket.on('start', (code) => {
        //socket.join(code);
        io.in(code).emit('start');
    })
})

app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`App started in port: ${PORT}`)
});