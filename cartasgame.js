
/** 
 * sets up the event listeners for socket.IO
 * 
*/
exports.initGame = function(socketIO, socket) {
	
    io = socketIO;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('hostCreateNewGame', createNewGame);
    
    function createNewGame() {
        console.log('New game creation request');
        
        // Create game with a unique Id between 0 and 100000
        var newGameId = ( Math.random() * 100000) | 0;

        // Return the game ID (newGameId) and the socket ID (mySocketId) to the client
        // 'this' refers to the Socket.IO object storing information for the client
        this.emit('newGameCreated', {gameId: newGameId, socketId: this.id});

        // store the new game in a room
        this.join(newGameId.toString());
    };

    /*
    function jugadorJoinsPartida() {
        var socket = this;

        // busco la partida en el gestor de Socket.IO
        var partida = gameSocket.gestor.partidas["/" + data.gameId];

        // Si la partida existe..
        if ( partida != undefined) {
            // guardamos el id del socket en el objeto recibido
            data.mySocketId = sock.id;

            // Registramos la partida
            sock.join(data.gameId);

            // Emitimos un evento notificando al creador que ya tiene rival.
            io.sockets.in(data.gameId).emit('rivalUnidoAPartida'), data);
        } else {
            // Si no se encuentra la partida que solicita el rival, contestarle con un error.
            this.emit('error', {message: "La partida solicitada no existe"});
        }

    }
    */
}