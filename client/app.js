// Enclosing function

var SERVER_URL = "http://gamori-tampin.codio.io:3000";	

var IO = {

    // código relacionado con las conexiones Socket.IO
    init: function() {
        // inititates a Socket.IO connection between the 
        // browser and the server
        IO.socket = io.connect(SERVER_URL);
        IO.bindEvents();
    },
    /*
     * While connected, Socket.IO will listen to the following events
     * emitted by the Socket.IO server.
     */
    bindEvents: function() {
      IO.socket.on('connected', IO.onConnected);
      IO.socket.on('newGameCreated', IO.onNewGameCreated);
    },
    
    /*
     * 'connected' event handler
     */
    onConnected: function() {
        App.Dom.updateConnStatus();
    },
    
    /*
     * 'newGameCreated' event handler
     */
    onNewGameCreated: function(data) {
        App.Dom.showGameData(data);
    }
}


var App = {
    // Código genérico de la logica de juego

	Player: {
        createGame: function() {
            IO.socket.emit('hostCreateNewGame');
        }
	},
    
    // functions that manipulates the DOM
    Dom: {
        updateConnStatus: function() {
        	$('#conn_status').text('Connected to server!');
			$('#btnNewGame').toggleClass('hidden');
        },
        // show the game's data on screen
        showGameData: function(data) {
            console.log('showing game data');
            var gameListItem = $('<li></li>');
            gameListItem.text('Id: ' + data.gameId + ', socket_id: ' + data.socketId);
            $('#gameList').append(gameListItem);
        }
    }
}
