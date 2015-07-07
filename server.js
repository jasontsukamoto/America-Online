//creates an instance of server named socket
var server = require('socket.io')();
var PORT = 8000;
var SOCKET_USER_REGISTRATION = 'user registration';
var SERVER_DISCONNECT = 'disconnect';
var SERVER_CONNECT = 'connect';
var USER_JOINED = 'user joined';
var USER_LEFT = 'user left';
var SOCKET_USER_MESSAGE = 'user message';
var UPDATE_NICKNAMES = 'update nicknames'

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

  //when a socket disconnects
  socket.on(SERVER_DISCONNECT, function() {
    socket.broadcast.emit(USER_LEFT, socket.nickname);
  });
});











// var PORT = 9000;
// var SOCKET_CONNECTION = 'connection';
// var SOCKET_USER_MESSAGE = 'user message';
// var SOCKET_USER_REGISTRATION = 'user registration';
// var SERVER_USER = 'Server';
// var SOCKET_USER_CONNECT = 'user connect';
// var SOCKET_USER_ONLINE = 'user online';
// var SOCKET_DISCONNECT = 'disconnect';
// var SOCKET_USER_OFFLINE = 'user offline';


// var socketIO = require('socket.io');

// var server = socketIO.listen(PORT);
// var nicknames = {};

// server.sockets.on(SOCKET_CONNECTION, function(socket) {

//   socket.on(SOCKET_USER_MESSAGE, function(message) {
//     //broadcast this message to all connected servers
//     socket.broadcast.emit(SOCKET_USER_MESSAGE, socket.nickname, message);
//   });

//   socket.on(SOCKET_USER_REGISTRATION, function(nickname, callback) {
//     if(nicknames.hasOwnProperty(nickname) || nickname.length === 0) {
//       //it's taken
//       callback(false);
//     } else {
//       //available! add it
//       nicknames[nickname] = nickname;

//       //assign the nickname to the socket
//       socket.nickname = nickname;

//       //broadcast the new user
//       socket.broadcast.emit(SOCKET_USER_CONNECT, nickname + ' has connected.');
//       socket.emit(SOCKET_USER_CONNECT, nickname + ' has connected.');
//       socket.broadcast.emit(SOCKET_USER_ONLINE, nickname)
//       socket.emit(SOCKET_USER_ONLINE, nickname);


//       //successful registration
//       callback(true);
//     }
//   });

//   server.sockets.on(SOCKET_DISCONNECT, function() {
//     socket.broadcast.emit(SOCKET_USER_OFFLINE, socket.nickname +' has disconnected');
//   });
// });

