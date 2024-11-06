const express = require('express');
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const messages = [];

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.emit('allMessages', messages);
    socket.on('chat message', (msg) => {
        const message = { text: msg.text, username: msg.username };
        messages.push(message);
        io.emit('chat message', message);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

