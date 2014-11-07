var server = require('http').createServer();
console.log(server);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
mongoose.connect('mongodb://node:123456@dogen.mongohq.com:10049/app29148336');

var Message = mongoose.model('Message', { 
                                          trade_id: Number,
                                          user_id:  Number,
                                          content:  String
                                        });



io.sockets.on('connection', function (socket) {
  var joinedRoom = null;

  console.log('socket connected');

  socket.on('join', function (room) {
    console.log('Joined room ' + room);
    socket.join(room);
    joinedRoom = room;

    return socket.broadcast.to(room).emit('new_user', { message: 'WELCOME ' + socket.id } );
  });

  socket.on('leave', function (room) {
    return socket.leave(room);
  });

  socket.on('disconnect', function () {
    return console.log('socket disconnected');
  });


  socket.on('send_message', function(data){
    socket.broadcast.to(joinedRoom).emit('get_message', data);

    var message = new Message({ trade_id: joinedRoom, user_id: data.user_id, content: data.message, img: data.img });
    message.save(function (err) {
      if (err) console.log('Error');
    });

    return;
  });

});

server.listen(port,function(){
  console.log('server online in port '+port);
});
