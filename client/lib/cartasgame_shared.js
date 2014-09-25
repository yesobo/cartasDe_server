/*
 * Shared logic between server and client 
 */
var deck = (function() {
    
    var playingQueue = [];
    var usedCards = [];
    
    var isLastInQueue = false;
        
    var test = function() {
        console.log('hola');
    };
    
    var win = function(carId) {
        usedCards.push(playingQueue.pop());
        usedCards.push(cardId);
    };
    
    var loose = function() {
        return playingQueue.pop();
    };
    
    var setInitCards = function(array) {
        playingQueue = array.slice(0);
    };
    
    var reloadPlayingQueue = function(array) {
        playingQueue = array.slice(0);
    };
    
	return {
        
    };   
    
})();

if (typeof exports != "undefined") {
	exports.gamePlay = gamePlay;    
}
