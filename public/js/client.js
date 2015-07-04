(function() {
  var SERVER_ADDRESS = 'http://localhost:9000';
  var SOCKET_CONNECT = 'connect';
  var SOCKET_DISCONNECT = 'disconnect';
  var SOCKET_RECONNECTING = 'reconnecting';
  var SOCKET_RECONNECT = 'reconnect';
  var SOCKET_ERROR = 'error';
  var SOCKET_USER_MESSAGE = 'user message';
  var SOCKET_USER_REGISTRATION = 'user registration';
  var SOCKET_USER_CONNECT = 'user connect';
  var SOCKET_USER_ONLINE = 'user online';
var SOCKET_USER_OFFLINE = 'user offline';



  var SYSTEM = 'System';


  var socket = io.connect(SERVER_ADDRESS);

  socket.on(SOCKET_CONNECT, function() {
    message(SYSTEM, 'Connected to ' + SERVER_ADDRESS);
  });

  socket.on(SOCKET_DISCONNECT, function() {
    message(SYSTEM, 'Disconnected from ' + SERVER_ADDRESS);
  });

  socket.on(SOCKET_RECONNECTING, function() {
    message(SYSTEM, 'Attempting to reconnect to ' + SERVER_ADDRESS);
  });

  socket.on(SOCKET_RECONNECT, function() {
    message(SYSTEM, 'Reconnected to ' + SERVER_ADDRESS);
  });

  socket.on(SOCKET_ERROR, function(err) {
    if (err !== undefined) {
      message(SYSTEM, err);
    } else {
      message(SYSTEM, 'An unknown error occured.');
    }
  });

  socket.on(SOCKET_USER_MESSAGE, function(from, userMessage) {
    message(from, userMessage);
  });

  socket.on(SOCKET_USER_CONNECT, function(nickname) {
    message('', nickname);
  });

  socket.on(SOCKET_USER_ONLINE, function(nickname) {
    userList(nickname);
  });

    socket.on(SOCKET_USER_ONLINE, function(nickname) {
    userList(nickname);
  });


  function message(from, message) {
    var newMessage = $('<p>');
    var fromTag = $('<b>', {
      html : from
    });
    var messageTag = $('<span>', {
      html : message
    });
    newMessage.append(fromTag);
    newMessage.append(messageTag);

    $('#chatlog')
      .append(newMessage);
    $('#chatlog')
      .get(0).scrollTop = Infinity;
  }

  function userList(nickname) {
    var onlineNickname = $('#onlineNickname');
    var onlineUser = $('<li>', {
      html : nickname
    });
    onlineNickname.append(onlineUser);
  }

  $('#messageForm').submit(function(event) {
    event.preventDefault();
    var messageField = $('#message');
    var theMessage = messageField.val();
    //add my message to the chatlog
    message('me', theMessage);
    //send my message to the server
    socket.emit(SOCKET_USER_MESSAGE, theMessage);
    //clear the message input field
    messageField.val('');
    //keep the page from refreshing
  });

  $('#registration_form').submit(function(event) {
    event.preventDefault();
    var nickname = $('#nickname').val();
    //send nickname to server
    socket.emit(SOCKET_USER_REGISTRATION, nickname, function(available) {
      //if nickname is available
      //  go to chatroom
      if (available) {
        changeStateToChatRoom();
      } else {
        //show error
        $('#nickname_error').text('Nickname already in use');
      }
    });
  });

  //manage state
  var registration = $('#registration');
  var chatroom = $('#chatroom');

  //default state
  //show registration
  //hide chatroom
  chatroom.hide();

  function changeStateToChatRoom() {
    chatroom.show();
    registration.hide();
  }

})();