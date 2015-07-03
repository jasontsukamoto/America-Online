(function() {
  var SERVER_ADDRESS = 'http://localhost:9000';
  var SOCKET_CONNECT = 'connect';
  var SOCKET_DISCONNECT = 'disconnect';
  var SOCKET_RECONNECTING = 'reconnecting';
  var SOCKET_RECONNECT = 'reconnect';
  var SOCKET_ERROR = 'error';


  var socket = io.connect(SERVER_ADDRESS);
console.log($);
console.log(io);
  // socket.on(SOCKET_CONNECT, function() {
  //   console.log('I connected');
  // });

  // socket.on(SOCKET_DISCONNECT, function() {
  //   console.log('disonnected');
  // });

  // socket.on(SOCKET_RECONNECTING, function() {
  //   console.log('reconnecting');
  // });

  // socket.on(SOCKET_RECONNECT, function() {
  //   console.log('reconnected');
  // });

  // socket.on(SOCKET_ERROR, function() {
  //   console.log('error');
  // });

  // socket.on(SOCKET_CONNECT, function() {
  //   console.log('I connected');
  // });

})();