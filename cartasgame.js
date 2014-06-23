
/**
 * sets up the event listeners for socket.IO
 *
*/
exports.initGame = function(socketIO, socket) {

    io = socketIO;
    gameSocket = socket;

    // comunicate to the client that is connected
    gameSocket.emit('connected',
			{
				socketId: socket.id,
				message: "You are connected!"
			});

    // Server willl listen for the following events
    gameSocket.on('hostCreateNewGame', createNewGame);
    gameSocket.on('hostJoinGame', joinGame);
    gameSocket.on('hostSendSpec', specSent);
    //gameSocket.on('hostRequestGames', sendRooms);

		//******** EVENT HANDLERS ********************//
    function createNewGame() {
        // Create game with a unique Id between 0 and 100000
        var newGameId = ( Math.random() * 100000) | 0;

        // Return the game ID (newGameId) and the socket ID
        // (mySocketId) to the client 'this' refers to the
        // Socket.IO object storing information for the client
        this.emit('newGameCreated',
          {
            gameId: newGameId,
            socketId: this.id
          });

        // store the new game in a room
        this.join(newGameId.toString());
    }

		function joinGame(data) {
				var socket = this;

        // search the room whose name is the game's id
				var room = io.sockets.adapter.rooms[data.gameId];
        // if room found, join the socket into it
				if ( room !== undefined) {
					socket.join(data.gameId);
          // comunicate players that both are in the room
					io.to(data.gameId).emit('gameReady');
				} else {
					this.emit('cartasDeError', {message: 'game not found'});
				}
		}

    function specSent(data) {
      var socket = this;
      // search the room whose name is the game's id
      var room = io.sockets.adapter.rooms[data.gameId];
      if ( room !== undefined) {
        // comunicate players if they won or lose
        console.log("room is: ");
        console.log(room);
        socket.broadcast.to(data.gameId).emit('youLoose');
        socket.emit('youWin');
      } else {
        this.emit('cartasDeError', {message: 'game not found'});
      }
    }

/*
    function sendRooms() {
        console.log('Hosted games requested');
        var rooms = io;
        console.log(io.sockets.adapter.rooms);


        this.emit('roomsSent', {
                  hostedGames: rooms
                 });

    }
*/

};
