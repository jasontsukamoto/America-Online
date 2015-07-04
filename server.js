var PORT = 9000;
var SOCKET_CONNECTION = 'connection';
var SOCKET_USER_MESSAGE = 'user message';
var SOCKET_USER_REGISTRATION = 'user registration';
var SERVER_USER = 'Server';
var SOCKET_USER_CONNECT = 'user connect';
var SOCKET_USER_ONLINE = 'user online';
var SOCKET_DISCONNECT = 'disconnect';
var SOCKET_USER_OFFLINE = 'user offline';


var socketIO = require('socket.io');

var server = socketIO.listen(PORT);
var nicknames = {};

server.sockets.on(SOCKET_CONNECTION, function(socket) {

  socket.on(SOCKET_USER_MESSAGE, function(message) {
    //broadcast this message to all connected servers
    socket.broadcast.emit(SOCKET_USER_MESSAGE, socket.nickname, message);
  });

  socket.on(SOCKET_USER_REGISTRATION, function(nickname, callback) {
    if(nicknames.hasOwnProperty(nickname) || nickname.length === 0) {
      //it's taken
      callback(false);
    } else {
      //available! add it
      nicknames[nickname] = nickname;

      //assign the nickname to the socket
      socket.nickname = nickname;

      //broadcast the new user
      socket.broadcast.emit(SOCKET_USER_CONNECT, nickname + ' has connected.');
      socket.emit(SOCKET_USER_CONNECT, nickname + ' has connected.');
      socket.broadcast.emit(SOCKET_USER_ONLINE, nickname)
      socket.emit(SOCKET_USER_ONLINE, nickname);


      //successful registration
      callback(true);
    }
  });

  server.sockets.on(SOCKET_DISCONNECT, function() {
    socket.broadcast.emit(SOCKET_USER_OFFLINE, socket.nickname +' has disconnected');
  });
});

