var http = require('http'),
    socketio = require('socket.io');

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end('hello world!\n');
}).listen(8222, function() {
    console.log('Listening on Port 8222');
});

socketio.listen(server).on('connection', function(socket) {
    socket.on('message', function(msg) {
        console.log('Message Recived:', msg);
        socket.broadcast.emit('message', msg);
    });
});
