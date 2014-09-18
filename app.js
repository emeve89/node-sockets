var server = require('http').createServer();
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });

    socket.emit('news', { name: 'THIS IS MY NODEJS SERVER' } );

    socket.on('my other event', function(data) {
      console.log(data);

      console.log(data.user_id);
      console.log(data.message);
    });

    io.sockets.on('connection', function(socket) {
      socket.on('send_message', function(data) {
        data.message = data.message + ' yo<br/>';
        socket.broadcast.emit('get_message', data);
      });
    });

});

server.listen(process.env.PORT || 5000)
