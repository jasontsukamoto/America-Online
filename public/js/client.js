(function() {
  var SERVER_ADDRESS = 'http://localhost:8000';
  var SERVER_CONNECT = 'connect';
  var SERVER_DISCONNECT = 'disconnect';
  var SOCKET_USER_REGISTRATION = 'user registration';
  var USER_JOINED = 'user joined';
  var USER_LEFT = 'user left';
  var UPDATE_NICKNAMES = 'update nicknames'




  var socket = io(SERVER_ADDRESS);

  socket.on(SERVER_CONNECT, function() {
    console.log(socket.id);
  });

  socket.on(USER_JOINED, function(nickname) {
    addMessage(nickname + ' has joined');
  });

  socket.on(UPDATE_NICKNAMES, function(nicknames) {
    var onlineList = $('#online_now');
    onlineList.empty();
    for (var k in nicknames) {
      addToOnlineUsers(nicknames[k]);
    }
  });

  socket.on(USER_LEFT, function(nickname) {
    removeOnlineUsers(nickname);
    addMessage(nickname + ' has left');
  });

  $('#message_form').submit(function() {
    emit9
  });

  //get value of nickname on registration
  $('#registration').submit(function(event) {
    //keeps page from refreshing
    event.preventDefault();

    var nickname = $('#nickname').val();
    socket.emit(SOCKET_USER_REGISTRATION, nickname, function(available) {
      //if available
      //  go to chatroom
      if (available) {
        goToChatRoom();
      } else {
        // show error
        $('#nickname_error').text('Invalid user name');
      }
    });
  });

  //add messages to chatroom
  function addMessage(message) {
    var chatlog = $('#chatlog');
    var message = $('<p>', {
      html : message
    });
    chatlog.append(message);
    // chatlog.get(0).scrollTop = Infinity;
    //     $('#chatlog')
//       .append(newMessage);
//     $('#chatlog')
//       .get(0).scrollTop = Infinity;
  }

  //add online users to online user bar
  function addToOnlineUsers(nickname) {
    var onlineList = $('#online_now');
    var onlineUsers = $('<li>', {
      html : nickname,
      id : nickname
    });
    onlineList.append(onlineUsers);
  }

  //remove users from online user bar
  function removeOnlineUsers(nickname) {
    $('#' + nickname + '').remove();
  }

  //default state
  $('#chatroom').hide();

  //manage state
  var registration = $('#registration');
  var chatroom = $('#chatroom');
  function goToChatRoom() {
    registration.hide();
    chatroom.show();
  }

})();





// (function() {
//   var SERVER_ADDRESS = 'http://localhost:9000';
//   var SOCKET_CONNECT = 'connect';
//   var SOCKET_DISCONNECT = 'disconnect';
//   var SOCKET_RECONNECTING = 'reconnecting';
//   var SOCKET_RECONNECT = 'reconnect';
//   var SOCKET_ERROR = 'error';
//   var SOCKET_USER_MESSAGE = 'user message';
//   var SOCKET_USER_REGISTRATION = 'user registration';
//   var SOCKET_USER_CONNECT = 'user connect';
//   var SOCKET_USER_ONLINE = 'user online';
// var SOCKET_USER_OFFLINE = 'user offline';



//   var SYSTEM = 'System';


//   var socket = io.connect(SERVER_ADDRESS);

//   socket.on(SOCKET_CONNECT, function() {
//     message(SYSTEM, 'Connected to ' + SERVER_ADDRESS);
//   });

//   socket.on(SOCKET_DISCONNECT, function() {
//     message(SYSTEM, 'Disconnected from ' + SERVER_ADDRESS);
//   });

//   socket.on(SOCKET_RECONNECTING, function() {
//     message(SYSTEM, 'Attempting to reconnect to ' + SERVER_ADDRESS);
//   });

//   socket.on(SOCKET_RECONNECT, function() {
//     message(SYSTEM, 'Reconnected to ' + SERVER_ADDRESS);
//   });

//   socket.on(SOCKET_ERROR, function(err) {
//     if (err !== undefined) {
//       message(SYSTEM, err);
//     } else {
//       message(SYSTEM, 'An unknown error occured.');
//     }
//   });

//   socket.on(SOCKET_USER_MESSAGE, function(from, userMessage) {
//     message(from, userMessage);
//   });

//   socket.on(SOCKET_USER_CONNECT, function(nickname) {
//     message('', nickname);
//   });

//   socket.on(SOCKET_USER_ONLINE, function(nickname) {
//     userList(nickname);
//   });

//     socket.on(SOCKET_USER_ONLINE, function(nickname) {
//     userList(nickname);
//   });


//   function message(from, message) {
//     var newMessage = $('<p>');
//     var fromTag = $('<b>', {
//       html : from
//     });
//     var messageTag = $('<span>', {
//       html : message
//     });
//     newMessage.append(fromTag);
//     newMessage.append(messageTag);

//     $('#chatlog')
//       .append(newMessage);
//     $('#chatlog')
//       .get(0).scrollTop = Infinity;
//   }

//   function userList(nickname) {
//     var onlineNickname = $('#onlineNickname');
//     var onlineUser = $('<li>', {
//       html : nickname
//     });
//     onlineNickname.append(onlineUser);
//   }

//   $('#messageForm').submit(function(event) {
//     event.preventDefault();
//     var messageField = $('#message');
//     var theMessage = messageField.val();
//     //add my message to the chatlog
//     message('me', theMessage);
//     //send my message to the server
//     socket.emit(SOCKET_USER_MESSAGE, theMessage);
//     //clear the message input field
//     messageField.val('');
//     //keep the page from refreshing
//   });

//   $('#registration_form').submit(function(event) {
//     event.preventDefault();
//     var nickname = $('#nickname').val();
//     //send nickname to server
//     socket.emit(SOCKET_USER_REGISTRATION, nickname, function(available) {
//       //if nickname is available
//       //  go to chatroom
//       if (available) {
//         changeStateToChatRoom();
//       } else {
//         //show error
//         $('#nickname_error').text('Nickname already in use');
//       }
//     });
//   });

//   //manage state
//   var registration = $('#registration');
//   var chatroom = $('#chatroom');

//   //default state
//   //show registration
//   //hide chatroom
//   chatroom.hide();

//   function changeStateToChatRoom() {
//     chatroom.show();
//     registration.hide();
//   }

// })();