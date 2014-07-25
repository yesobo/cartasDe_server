// Enclosing function
//var SERVER_URL = "http://localhost:3000";
/* if developing in codio environment */
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
        IO.socket.on('cartasDeError', IO.onErrorMsg);
        IO.socket.on('gameReady', IO.onGameReady);
        IO.socket.on('youWin', IO.onYouWin);
        IO.socket.on('youLoose', IO.onYouLoose);
    },
    //************EVENT HANDLERS *********************//
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
        App.setGameId(data.gameId);
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
    },
    onYouWin: function() {
        console.log('You Win!!');
        App.Dom.showResult("you win!!");
    },
    onYouLoose: function() {
        console.log('You Loose!!');
        App.Dom.showResult("you loose!!");
    }
}; // end IO namespace
var App = function() {
    var gameId = "",
        playerId = "";
    // functions that manipulates the DOM
    var Aux = {
        buildJoinGameData: function() {
            var inputGameVal = $('#idPartida').val();
            return {
                gameId: inputGameVal
            };
        },
        buildSelectedSpec: function() {
            return {
                gameId: gameId,
                playerId: playerId,
                specName: "cilindrada",
                specValue: "500"
            };
        }
    }; // end Aux namespace
    var Dom = {
        updateConnStatus: function(data) {
            $('#conn_status').text(data.message + " to socket: " + data.socketId);
            // show player controls
            $('#playerScreen').toggleClass('hidden');
        },
        // show the created game data on screen
        showCreatedGameData: function(data) {
            console.log('showing game data');
            var gameListItem = $('<li></li>');
            gameListItem.text('Id: ' + data.gameId + ', socket_id: ' + data.socketId);
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
        },
        showResult: function(text) {
            $('#lblResult').text(text);
        }
    }; // end Dom namespace
    // Code for game logic
    var Player = {
        createGame: function() {
            IO.socket.emit('hostCreateNewGame');
        },
        joinGame: function() {
            var data = Aux.buildJoinGameData();
            IO.socket.emit('hostJoinGame', data);
        },
        sendSpec: function() {
            var data = Aux.buildSelectedSpec();
            IO.socket.emit('hostSendSpec', data);
        }
        /*,
    requestHostGames: function() {
        console.log('requesting hosted games...');
        IO.socket.emit('hostRequestGames');
    }
    */
    }; // end Player namespace
    return {
        Aux: Aux,
        Dom: Dom,
        Player: Player,
        setGameId: function(id) {
            gameId = id;
        },
        getGameId: function() {
            return gameId;
        }
    };
}(); // end App namespace