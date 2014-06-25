var player = function() {
    var playingQueue = [];
    var usedCards = [];
    
    var win = function(carId) {
        usedCards.push(playingQueue.pop());
        usedCards.push(cardId);
    }
    
    var loose = function() {
        return playingQueue.pop();
    }
    
    var setInitCards = function(array) {
        playingQueue = array.slice(0);
    }
    
    var reloadPlayingQueue = function(array) {
        playingQueue = array.slice(0);
    }
    
	return {
        
    }    
};

var utils = {
    shuffle: function(array) {
  		var currentIndex = array.length
    		, temporaryValue
    		, randomIndex;

 	 	// While there remain elements to shuffle...
  		while (0 !== currentIndex) {

    		// Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
  		}

  		return array;
	} // end shuffle    
}

var host = (function() {
	
    var cards = [1, 2, 3, 4];
    
    var player1 = new player();
    var player2 = new player();
    var turn = 1;
    
    var deal = function() {
        var shuffledDeck = utils.shuffle(cards);
        var halfCards = cards.length / 2;
        player1.setInitCards(suffledDeck.slice(0, halfCards));
        player2.setInitCards(suffledDeck.slice(halfCards, cards.length));
    }
    
    var player1Wins = function() {
        player1.giveCard();
    }
    
    return {
        
    }
    
})();
