var uuid = require('node-uuid'),
    Player = require('./player').Player,
    utils = require('./utils').utils,
    cards = require('./cards').cards;


var Game = exports.Game = (function() {
    
    function Game(options) {
        
        if ( typeof options != 'undefined' && 
				options.creator instanceof Player) {
            
            this.id = uuid.v1();
        	this.cards = options.cards;
            this.player1 = options.creator;
            this.turn = true;
            
            this.switchTurn = function() {
		        this.turn = !this.turn;
            };
			
			this.deal = function() {
				if(this.gameReady()) {
					var shuffledDeck = utils.shuffle(this.cards);
					var halfCards = this.cards.length / 2;
					this.player1.setInitCards(shuffledDeck.slice(0, halfCards));
					this.player2.setInitCards(shuffledDeck.slice(halfCards, this.cards.length));
				} else {
					return new Error("waiting for opponent");
				}
			};

                
        } else {
            return new Error("No creator is provided");
        }
    }
	
    Game.prototype.getId = function() {
        return this.id;
    };
    
    Game.prototype.join = function(opponent) {
        if( opponent instanceof Player ) {
            this.player2 = opponent;
			this.deal();
        } else {
            return new Error("a player must be provided");
        }
    };
    
    Game.prototype.gameReady = function() {
        return (typeof this.player1 !== 'undefined' &&
           typeof this.player2 !== 'undefined');
    };
    
    Game.prototype.getPlayer1 = function() {
        return this.player1;
    };
    
    Game.prototype.getPlayer2 = function() {
        if(this.player2) {
        	return this.player2;    
        } else {
            return new Error("waiting for opponent");
        }
    };
        
    Game.prototype.countCards = function() {
        return this.cards.length;
    };
    
    Game.prototype.player1Wins = function() {
        if( this.gameReady() ) {
          this.player1.win(this.player2.loose());
            if(!this.turn) {
                this.switchTurn();
            }
        } else {
            return new Error("waiting for opponent");
        }
    };

    Game.prototype.player2Wins = function() {
        if( this.gameReady() ) {
          this.player2.win(this.player1.loose());
            if(this.turn) {
                this.switchTurn();
            }
        } else {
            return new Error("waiting for opponent");
        }
    };
    
    Game.prototype.whoseTurn = function() {
		if( this.gameReady() ) {
	        return this.turn?this.player1.getId():this.player2.getId();
        } else {
            return new Error("Waiting for opponent");
        }
    };
	
	Game.prototype.compareSpec = function(specName) {
		if(this.gameReady()) {
			var player1_cardId = this.getPlayer1().getPlayingCard();
			var player2_cardId = this.getPlayer2().getPlayingCard();
			var spec1 = cards[player1_cardId][specName];
			var spec2 = cards[player2_cardId][specName];
			
			if(specName && spec1 && spec2) {
				var value1 = spec1.valor;
				var value2 = spec2.valor;
				var mayor = cards[player2_cardId][specName].mayor;
				if(Number(value1) > Number(value2)) {
					if(mayor) {
						return 1;	
					} else {
						return 2;
					}
				} else {
					if(value1 === value2) {
						return 0;
					} else {
						if(mayor) {
							return 2;	
						} else {
							return 1;
						}
					}
				}
			} else {
				return new Error('invalid specification provided');
			}
		} else {
			return new Error('Waiting for opponent');
		}
	};

    return Game;
})();
