
/**
 * sets up the event listeners for socket.IO
 *
*/
exports.initGame = function(socketIO, socket) {

    io = socketIO;
    gameSocket = socket;
		console.log(socket.id);
    gameSocket.emit('connected',
			{
				socketId: socket.id,
				message: "You are connected!"
			});

    // Host Events ------------------------
    gameSocket.on('hostCreateNewGame', createNewGame);
    gameSocket.on('hostJoinGame', joinGame);
		//gameSocket.on('hostRequestGames', sendRooms);

		// Handler functions ----------------------
    function createNewGame() {
        console.log('New game creation request');

        // Create game with a unique Id between 0 and 100000
        var newGameId = ( Math.random() * 100000) | 0;

        // Return the game ID (newGameId) and the socket ID (mySocketId) to the client
        // 'this' refers to the Socket.IO object storing information for the client
        this.emit('newGameCreated',
                  {
                      gameId: newGameId,
                      socketId: this.id
                  });

        // store the new game in a room
        this.join(newGameId.toString());
    };


		function joinGame(data) {
				var socket = this;

				var room = io.sockets.adapter.rooms[data.gameId];

				if ( room != undefined) {
					data.mySocketId = socket.id;
					socket.join(data.gameId);
					io.to(data.gameId).emit('gameReady');
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

}
