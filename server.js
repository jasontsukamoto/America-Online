var PORT = 9000;
var SOCKET_CONNECTION = 'connection';

var socketIO = require('socket.io');

var server = socketIO.listen(PORT);

server.sockets.on(SOCKET_CONNECTION, function() {
  console.log('connected');
});