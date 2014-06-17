// Enclosing function

var SERVER_URL = "http://localhost:3000"
/* if developing in codio environment */
//var SERVER_URL = "http://gamori-tampin.codio.io:3000";


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
      IO.socket.on('cartasDeError', IO.onErrorMsg);
      IO.socket.on('gameReady', IO.onGameReady)
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
    },

    /*
    * 'error' event handler
    */
    onErrorMsg: function(data) {
      App.Dom.showError(data);
    },

    /*
    * 'gameReady' event handler
    */
    onGameReady: function() {
      App.Dom.showStatus("game ready");
    }
};

var Aux = {
  buildData: function() {
    var inputGameVal = $('#idPartida').val();
    return {
      gameId: inputGameVal
    }
  }
}

var App = {
  // functions that manipulates the DOM
  Dom: {
      updateConnStatus: function(data) {
          $('#conn_status').text(data.message + " to socket: "
            + data.socketId);
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
      },
      showError: function(data) {
        $('#lblError').text(data.message);
      },
      showStatus: function(text) {
        $('#lblError').text(text);
      }
  },

  // Code for game logic

	Player: {
        createGame: function() {
            IO.socket.emit('hostCreateNewGame');
        },
        joinGame: function() {
            var data = Aux.buildData();
            IO.socket.emit('hostJoinGame', data);
        },
        requestHostGames: function() {
            console.log('requesting hosted games...');
            IO.socket.emit('hostRequestGames');
        }
	}

}
