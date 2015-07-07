//creates an instance of server named socket
var server = require('socket.io')();
var PORT = 8000;
var SOCKET_USER_REGISTRATION = 'user registration';
var SERVER_DISCONNECT = 'disconnect';
var SERVER_CONNECT = 'connect';
var USER_JOINED = 'user joined';
var USER_LEFT = 'user left';
var SOCKET_USER_MESSAGE = 'user message';
var UPDATE_NICKNAMES = 'update nicknames';
var SOCKET_USER_MESSAGE = 'user message';


var nicknames = {};

//attaches socket bound to port 8000
server.attach(PORT);

//when a socket connects
server.on(SERVER_CONNECT, function(socket) {

  //when a socket registers
  socket.on(SOCKET_USER_REGISTRATION, function(nickname, callback) {

    //check if nickname is in nicknames object
    if (nicknames.hasOwnProperty(nickname)  || nickname.length === 0) {
      //it's taken!
      callback(false);
    } else {
      //add it to nicknames object
      nicknames[nickname] = nickname;

      //add it to the socket
      socket.nickname = nickname;

      //broadcast it
      socket.emit(USER_JOINED, nickname);
      socket.broadcast.emit(USER_JOINED, nickname);
      socket.emit(UPDATE_NICKNAMES, nicknames);
      socket.broadcast.emit(UPDATE_NICKNAMES, nicknames);

      //successful registration
      callback(true);
    }
  });

  //when a user sends a message
  socket.on(SOCKET_USER_MESSAGE, function(message) {
    socket.broadcast.emit(SOCKET_USER_MESSAGE, socket.nickname, message);
  });

  //when a socket disconnects
  socket.on(SERVER_DISCONNECT, function() {
    socket.broadcast.emit(USER_LEFT, socket.nickname);
  });
});