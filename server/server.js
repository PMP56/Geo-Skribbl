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

    socket.on('clear', (code) => {
        io.in(code).emit('clear');
    });

    socket.on('mouseDown', ({ code, data }) => {

        socket.to(code).emit('mouseDown', data);
    });
    socket.on('mouseMove', ({ code, data }) => {
        //socket.join(code);
        socket.to(code).emit('mouseMove', data);
    });
    socket.on('mouseUp', (code) => {
        //socket.join(code);
        socket.to(code).emit('mouseUp');
    });

    socket.on('join', ({ code, user, mode }) => {

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

    socket.on('turnChange', ({ turn, code, last }) => {
        if (!last) {
            io.in(code).emit('turnChange', turn + 1)
        } else {
            io.in(code).emit('turnChange', 0)
        }
    })
})

app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
    console.log(`App started in port: ${PORT}`)
});