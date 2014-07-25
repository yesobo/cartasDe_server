var Player = exports.Player = (function() {
   
    function Player(id) {
        if(id !== undefined) {
            this.id = id;
            this.playingQueue = [];
            this.usedCards = [];
        } else {
            return new Error("player id must be provided");
        }
    }
    
    Player.prototype.getId = function() {
        return this.id;
    };
    
    Player.prototype.setInitCards = function(array) {
        this.playingQueue = array.slice(0);
        this.usedCards = [];
    };
    
    Player.prototype.win = function(cardId) {
        if(cardId) {
            if(this.playingQueue.length) {
                this.usedCards.push(this.playingQueue.shift());
            }
            this.usedCards.push(cardId);
        }
    };
    
    Player.prototype.loose = function() {
        return this.playingQueue.shift();
    };
    
    Player.prototype.reloadPlayingQueue = function(array) {
        this.playingQueue = array.slice(0);
    };
    
    Player.prototype.getDeck = function() {
        return this.usedCards.concat(this.playingQueue);
    };
    
    Player.prototype.getPlayingCard = function() {
		return this.playingQueue[0];
    };
    
    return Player;
            
})();