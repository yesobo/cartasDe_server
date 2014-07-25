var Game = require('./game').Game;
var Player = require('./player').Player;
var cards = require('./cards').cards;
var games = {};


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
    function createNewGame(data) {        
        if(data !== undefined &&
		   	data.userId) {
            
			// create a player object for the connected user
            var creator = new Player(data.userId);

            // Create game with a unique Id between 0 and 100000
            var gameOptions = {
				creator: creator,
				cards: Object.keys(cards)
			};
            var newGame = new Game(gameOptions);

            // Return the game ID and the socket ID
            // to the client, 'this' refers to the
            // Socket.IO object storing information for the client
            this.emit('newGameCreated',
              {
                gameId: newGame.getId(),
                socketId: this.id
              });

            // store the game in the game storage
            games[newGame.getId()] = newGame;
            // store the new game in a room
            this.join(newGame.getId());
        } else {
            this.emit('cartasDeError', {
                message: "user id must be provided"
            });
        }
    }

    function joinGame(data) {
        var socket = this;
        
        // search the room whose name is the game's id
        var room = io.sockets.adapter.rooms[data.gameId];
        //get the game from the games storage
        var game = games[data.gameId];
        // if room found, join the socket into it
        if ( room !== undefined &&
           	game !== undefined) {
            socket.join(data.gameId);

            // create a Player for the user and join the game
            game.join(new Player("player2"));

            // comunicate players that both are in the room
            io.to(data.gameId).emit('gameReady');
        } else {
            this.emit('cartasDeError', {message: 'game not found'});
        }
    }

    function specSent(data) {

	  var socket = this;
      // get the game requested from the game storage
	  
	  var game = games[data.gameId];
      // search the room whose name is the game's id
      var room = io.sockets.adapter.rooms[data.gameId];
      
	  if ( room !== undefined &&
		  	game !== undefined) {
          
		  var playerId = data.playerId;
		  if(playerId !== undefined) {
        	// comunicate players if they won or lose
			if(game.whoseTurn() === data.playerId) {
				var result = game.compareSpec(data.specName);
				if(! (result instanceof Error)) {
					if(result === 1) {
						game.player1Wins();
						if(data.playerId === game.getPlayer1().getId()) {
							socket.emit('youWin');
							socket.broadcast.to(data.gameId).emit('youLoose');
						} else {
							socket.emit('youLoose');
							socket.broadcast.to(data.gameId).emit('youWin');
						}
					} else {
						if(result === 2) {
							game.player2Wins();
							if(data.playerId === game.getPlayer1().getId()) {
								socket.emit('youLoose');
								socket.broadcast.to(data.gameId).emit('youWin');
							} else {
								socket.emit('youWin');
								socket.broadcast.to(data.gameId).emit('youLoose');
							}
						}
					}
				} else {
					var errorMessage =  result.message;
					socket.emit('cartasDeError', 
								{message: errorMessage});
				}
            } else {
				socket.emit('cartasDeError', 
							{message: 'not your turn'});
            }
          } else {
			  socket.emit('cartasDeError', {
                  message: 'player not found'
              });
          }
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
