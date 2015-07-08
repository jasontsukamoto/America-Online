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
var SOCKET_USER_MENTION = 'user mention';
var KICK = 'kick';
var CHANGE_STATE = 'change state';
var RATELIMIT_VIOLATED = 'ratelimit violated';
var USER_BANNED = 'user banned';
var USER_UNBANNED = 'user unbanned';

var nicknames = {};
var bannedUsers = {};
var rateLimiter = 0;
var violations = 0;
//attaches socket bound to port 8000
server.attach(PORT);

//when a socket connects
server.on(SERVER_CONNECT, function(socket) {

  //when a socket registers
  socket.on(SOCKET_USER_REGISTRATION, function(nickname, callback) {

    //check if nickname is in nicknames object
    if (nicknames.hasOwnProperty(nickname)  || nickname.length === 0 || bannedUsers.hasOwnProperty(nickname)) {
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
    // rateLimiter++;
    // setTimeout(function() {
    //   rateLimiter = 0;
    // }, 2000);

    // if (rateLimiter < 10) {
    //   socket.broadcast.emit(SOCKET_USER_MESSAGE, socket.nickname, message);
    //   socket.broadcast.emit(SOCKET_USER_MENTION, message, nicknames);
    // } else {
    //   violations++;
    //   // socket.disconnect();
    // }

    // if (violations === 5) {
    //   var reason = 'for exceeding the rate limit';
    //   socket.emit(CHANGE_STATE)
    //   socket.broadcast.emit(KICK, socket.nickname, reason);
    //   socket.disconnect();
    //   console.log(socket.nickname + ' ' + socket.handshake.address + ' has been kicked');
    // }

  });

  //when a socket disconnects
  socket.on(SERVER_DISCONNECT, function() {
    socket.broadcast.emit(USER_LEFT, socket.nickname);
    delete nicknames[socket.nickname];
  });

});

process.stdin.on('data', function(chunk) {
  var substring = chunk.toString('utf-8').split('\n')[0].split(' ');
  // console.log(server.sockets);
  if (substring[0] === '/kick') {
    substring.splice(0, 1);
    for (var i = 0; i < server.sockets.sockets.length; i++) {
      var client = server.sockets.sockets[i];
      if (client.nickname === substring[0]) {
        substring.splice(0, 1);
        var reason = substring.join(' ');
        client.emit(CHANGE_STATE)
        client.broadcast.emit(KICK, client.nickname, reason);
        client.disconnect();
        console.log(client.nickname + ' ' + client.handshake.address + ' has been kicked');
      }
    }
  }

  if (substring[0] === '/ban') {
    substring.splice(0, 1);
    for (var i = 0; i < server.sockets.sockets.length; i++) {
      var client = server.sockets.sockets[i];
      if (client.nickname === substring[0] || client.handshake.address === substring[0]) {
        bannedUsers[substring[0]] = client.handshake.address;
        console.log(client.nickname + ' ' + client.handshake.address + ' has been added to the ban list.');
        client.emit(CHANGE_STATE);
        client.broadcast.emit(USER_BANNED, client.nickname);
        client.disconnect();
      }
    }
  }

  if (substring[0] === '/unban') {
    substring.splice(0, 1);
    for (var i = 0; i < server.sockets.sockets.length; i++) {
      var client = server.sockets.sockets[i];
      if ( bannedUsers.hasOwnProperty(substring[0])) {
        console.log(substring[0] + ' has been unbanned.');
        delete bannedUsers[substring[0]];
        client.emit(USER_UNBANNED, substring[0]);
        client.broadcast.emit(USER_UNBANNED, substring[0]);
      }
    }
  }

});
