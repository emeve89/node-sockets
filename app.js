var server = require('http').createServer();
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  console.log('socket connected');

  socket.on('join', function (room) {
    console.log('Joined room ' + room);
    socket.join(room);
  });


  socket.on('disconnect', function () {
    console.log('socket disconnected');
  });

  // io.sockets.socket(socket.id).
  socket.broadcast.emit('new_user', { message: 'WELCOME ' + socket.id } );

  // socket.on('my other event', function(data) {
  //   console.log(data);

  //   console.log(data.user_id);
  //   console.log(data.message);
  // });

  // socket.on('send_message', function(data) {
  //   console.log(data.message);
  //   socket.broadcast.emit('get_message', data);
  // });

  socket.on('send_message', function(data){
    socket.broadcast.emit('get_message', data);
  });

});

server.listen(process.env.PORT || 5000)
