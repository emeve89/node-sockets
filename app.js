var server = require('http').createServer();
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  var joinedRoom = null;

  console.log('socket connected');

  socket.on('join', function (room) {
    console.log('Joined room ' + room);
    socket.join(room);
    joinedRoom = room;

    socket.broadcast.to(room).emit('new_user', { message: 'WELCOME ' + socket.id } );
  });

  socket.on('disconnect', function () {
    console.log('socket disconnected');
  });


  socket.on('send_message', function(data){
    socket.broadcast.to(joinedRoom).emit('get_message', data);
  });

});

server.listen(process.env.PORT || 5000)
