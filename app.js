var server = require('http').createServer();
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');


mongoose.connect('mongodb://node:123456@dogen.mongohq.com:10049/app29148336');
//mongoose.connect('mongodb://localhost/trade_a_grape_api_development');

var MessageSchema = { 
                      trade_id: Number,
                      user_id:  Number,
                      content:  String
                    }
var Message = mongoose.model('Message', MessageSchema);



io.sockets.on('connection', function (socket) {

  var  joinedRoom = null 
      ,my_user_id = null;

  console.log('socket connected');

  socket.on('login_user', function(user_id){
    console.log('LOGIN_USER '+user_id);
    my_user_id = user_id;
    return socket.join('user_'+user_id);
  });

  socket.on('update_wine_informations', function(user_id){
    console.log('update_wine_informations');
    console.log(user_id);
    if(user_id) socket.broadcast.to( 'user_'+ user_id ).emit('update_wine_informations_client');
    return      socket.emit('update_wine_informations_client');
  });

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

    console.log('update_lat_message');

    socket.emit('update_last_message_client', joinedRoom, data);
    socket.broadcast.to('user_'+ data.user_to.id).emit('update_last_message_client', joinedRoom, data);

    var message = new Message({ trade_id: joinedRoom, user_id: data.user.id, content: data.message });
    return message.save(function (err) {
      if (err) console.log('Error');
    });
  });

});

server.listen(port,function(){
  console.log('server online in port '+port);
});
