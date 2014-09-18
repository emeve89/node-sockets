var server = require('http').createServer();
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });

    socket.emit('news', { hello: 'world' } );

    socket.on('my other event', function(data) {
      console.log(data);

      console.log(data.user_id);
      console.log(data.message);
    });

});

server.listen(3000, function() {
  console.log("Server running on port 3000\n");
});
