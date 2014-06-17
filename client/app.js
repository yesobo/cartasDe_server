// Enclosing function

var SERVER_URL = "http://gamori-tampin.codio.io:3000";	

var IO = {
    // Code for server connections
    
    /*
     * Inititates a Socket.IO connection between the 
     * browser and the server
     */
    init: function() {
        IO.socket = io.connect(SERVER_URL);
        IO.bindEvents();
    },
    
    /*
     * While connected, Socket.IO will listen to the 
     * following events emitted by the Socket.IO server.
     */
    bindEvents: function() {
      IO.socket.on('connected', IO.onConnected);
      IO.socket.on('newGameCreated', IO.onNewGameCreated);
      IO.socket.on('roomsSent', IO.onRoomsSent);
    },
    
    /*
     * 'connected' event handler
     */
    onConnected: function(data) {
        App.Dom.updateConnStatus(data);
        App.Dom.showHostedGames(data);
    },
    
    /*
     * 'newGameCreated' event handler
     */
    onNewGameCreated: function(data) {
        App.Dom.showCreatedGameData(data);
    },
    
    /*
     * 'roomsSent' event handler
     */
    onRoomsSent: function(data) {
        App.Dom.showHostedGames(data);
    }
}


var App = {
    // Code for game logic
    gameToJoin: {
        gameId: '',
        socketId: ''
    },
    
	Player: {
        createGame: function() {
            IO.socket.emit('hostCreateNewGame');
        },
        joinGame: function() {
            IO.socket.emit('hostJoinGame', data);
        },
        requestHostGames: function() {
            console.log('requesting hosted games...');
            IO.socket.emit('hostRequestGames');
        }
	},
    
    // functions that manipulates the DOM
    Dom: {
        updateConnStatus: function() {
        	$('#conn_status').text('Connected to server!');
            // show player controls
			$('#playerScreen').toggleClass('hidden');
        },
        // show the created game data on screen
        showCreatedGameData: function(data) {
            console.log('showing game data');
            var gameListItem = $('<li></li>');
            gameListItem.text('Id: ' + data.gameId 
            	+ ', socket_id: ' + data.socketId);
            $('#createdGamesList').append(gameListItem);
        },
        showHostedGames: function(data) {
            console.log('hosted games:');
            console.log(data);
        }
    }
}
