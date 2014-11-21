var server = require('http').createServer()
  , io = require('socket.io')(server)
  , port = process.env.PORT || 5000
  , mongoose = require('mongoose')
;

/**********CONNECT MONGOOSE*************/
mongoose.connect('mongodb://node:123456@dogen.mongohq.com:10049/app29148336');
//mongoose.connect('mongodb://localhost/trade_a_grape_api_development');

/********** SCHEMA MESSAGE **************/

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MessageSchema = { 
                      trade_id: Number,
                      user_id:  Number,
                      content:  String,
                      wine_id: ObjectId
                    }

var Message = mongoose.model('Message', MessageSchema);


/******** SOCKET CONNECTION *********/
io.sockets.on('connection', function (socket) {

  var  joinedRoom = null;

  /** LOGS **/
    console.log('socket connected');
  /** LOGS **/


  socket.on('login_user', function(user_id){
    console.log('LOGIN_USER '+user_id);
    return socket.join('user_'+user_id);
  });


  socket.on('update_wine_informations', function(user_id){

    /** LOGS **/
      console.log('update_wine_informations');
      console.log(user_id);
    /** LOGS **/

    if(user_id) socket.broadcast.to( 'user_'+ user_id ).emit('update_wine_informations_client');
    return      socket.emit('update_wine_informations_client');
  });

  socket.on('join', function (room) {

    /** LOGS **/
      console.log('Joined room ' + room);
    /** LOGS **/

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

    console.log('MESSAGE TO: '  + data.user_to.id);
    socket.broadcast.to(joinedRoom).emit('get_message', data);
    
    if(joinedRoom){
      socket.emit('update_last_message_client', joinedRoom, data);
      socket.broadcast.to('user_'+ data.user_to.id).emit('update_last_message_client', joinedRoom, data);
    }


    var message = new Message({ trade_id: joinedRoom, user_id: data.user.id, content: data.message, wine_id: data.wine_id });

    return message.save(function (err) {
      if (err) console.log('Error');
    });

  });

});

/****** START SERVER **********/

server.listen(port,function(){
  return console.log('server online in port '+port);
});
