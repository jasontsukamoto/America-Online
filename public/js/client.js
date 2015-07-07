(function() {
  var SERVER_ADDRESS = 'http://localhost:8000';
  var SERVER_CONNECT = 'connect';
  var SERVER_DISCONNECT = 'disconnect';
  var SOCKET_USER_REGISTRATION = 'user registration';
  var USER_JOINED = 'user joined';
  var USER_LEFT = 'user left';
  var UPDATE_NICKNAMES = 'update nicknames';
  var SOCKET_USER_MESSAGE = 'user message';
  var SOCKET_USER_MENTION = 'user mention';

  var myNickname = null;
  var socket = io(SERVER_ADDRESS);

  socket.on(SERVER_CONNECT, function() {
    console.log(socket.id);
  });

  socket.on(USER_JOINED, function(nickname) {
    addMessage('', nickname + ' has joined');
  });

  socket.on(UPDATE_NICKNAMES, function(nicknames) {
    var onlineList = $('#online_now');
    onlineList.empty();
    for (var k in nicknames) {
      addToOnlineUsers(nicknames[k]);
    }
  });

  //on user message
  socket.on(SOCKET_USER_MESSAGE, function(from, theMessage) {
    var parseMessage = theMessage.split(' ');
    for (var i = 0; i < parseMessage.length; i++) {
      if (parseMessage[i] === myNickname) {
        parseMessage[i] = '<span class="highlightedNickname">' + myNickname + '</span>';
      }
    }
    parseMessage = parseMessage.join(' ');
    addMessage(from, parseMessage);

  });

  //handle event when user leaves
  socket.on(USER_LEFT, function(nickname) {
    removeOnlineUsers(nickname);
    addMessage('', nickname + ' has left');
  });

  $('#message_form').submit(function(event) {
    event.preventDefault();
    var messageField = $('#messages');
    theMessage = messageField.val();

    //add message to chatlog
    addMessage('me', theMessage);

    //broadcast message to other sockets
    socket.emit(SOCKET_USER_MESSAGE, theMessage);

    //clear message field
    $('#messages').val('');
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
        myNickname = nickname;
        goToChatRoom();
      } else {
        // show error
        $('#nickname_error').text('Invalid user name');
      }
    });
  });

  //add message function
  function addMessage(from, message) {
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
      .append(newMessage)
      .get(0).scrollTop = Infinity;
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
