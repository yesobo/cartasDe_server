/*jshint -W030 */

var chai = require('chai'),
    mocha = require('mocha'),
    sinon = require('sinon'),
    should = chai.should(),
    game_module = require('../game'),
    player_module = require('../player');

describe("Game object", function() {

    var Game,
        Player,
        game, 
        creator;
	
	var PLAYER_1_ID = 'player1Id';
	var PLAYER_2_ID = 'player2Id';	

    before(function(done) {
        Game = game_module.Game;
        Player = player_module.Player;
        creator = new Player(PLAYER_1_ID);
        done();
    });

    describe("constructor", function() {

        it("should return an error when no creator player has been provided",
           function(done) {
               game = new Game();
               game.should.be.instanceof(Error);
               done();
           });

        it("should return an error if provided creator is not a Player objtect",
           function(done) {
               var options = {
                   creator: "99999"
               };
               game = new Game(options);
               game.should.be.instanceof(Error);
               done();
           });

        it("should return a Game object with the default settings",
           function(done) {
               var options = {
                   creator: creator,
                   cards: ['1', '2', '3', '4']
               };
               game = new Game(options);
               game.should.be.instanceof(Game);
               done();
           });
    });

    describe("public function", function() {

        before(function(done) {
            var options = {
                creator: creator,
                cards: ['1', '2', '3', '4']
            };
            game = new Game(options);
            done();
        });

        describe("before joining", function() {
			
            it("'getId', should return the id of the game",
              function(done) {
                  game.getId().should.exist;
                  done();
              });
            
            it("'countCards', should return the number of cards",
               function(done) {
                   game.countCards().should.be.equal(4);
                   done();
               });

            it("'getPlayer1', should return the creator Player",
               function(done) {
                   var player1 = game.getPlayer1(); 
                   player1.should.be.instanceof(Player);
                   player1.should.be.equal(creator);
                   done();
               });

            it("'getPlayer2, should return Error",
               function(done) {
                   var player2 = game.getPlayer2();
                   player2.should.be.instanceof(Error);
                   done();
               });

            it("'player1Wins' should return an Error",
               function(done) {
                   var result = game.player1Wins();
                   result.should.be.instanceof(Error);
                   done();
               });

            it("'player2Wins' should return an Error if game is not ready",
               function(done) {
                   var result = game.player2Wins();
                   result.should.be.instanceof(Error);
                   done();
               });

            it("'deal', should return an Error object",
               function(done) {
                   var result = game.deal();
                   result.should.be.instanceof(Error);
                   done();
               });
            
            it("'whoseTurn', should return an Error",
              function(done) {
                  game.whoseTurn().should.be.instanceof(Error);
                  done();
              });
            
            it("'compareSpec', should return an Error",
              function(done) {
                  game.compareSpec().should.be.instanceof(Error);
                  done();
              });

            it("'join', should return an error if a Player object is not provided",
               function(done) {
                   var result = game.join('opponent');
                   result.should.be.instanceof(Error);
                   game.gameReady().should.be.false;
                   done();
               });

            it("'join', should add a second player to the game",
               function(done) {
                   game.join(new Player(PLAYER_2_ID));
                   game.gameReady().should.be.true;
                   done();
               });
        });

        describe("after join", function() {

            before(function(done) {
                game.join(new Player(PLAYER_2_ID));
                done();
            });

            it("the game should be ready", function(done) {
                game.gameReady().should.be.true;
                done();
            });

            it("'deal' should give half the cards to each player",
               function(done) {
                   var gameplay = game.deal();
                   var halfCards = game.countCards() / 2;
                   game.getPlayer1().getDeck().should.have.length(halfCards);
                   game.getPlayer2().getDeck().should.have.length(halfCards);
                   done();
               });
        });

        describe("after dealing", function() {

            before(function(done) {
                game.join(new Player(PLAYER_2_ID));
                done();
            });
            
            beforeEach(function(done) {
                game.deal();
                done();
            });
            
            it("'whoseTurn' should return 1 as is the creator's turn",
              function(done) {
                  game.whoseTurn().should.be.equal(PLAYER_1_ID);
                  done();
              });

            it("'compareSpec', should return an Error if no spec provided",
              function(done) {
                  game.compareSpec().should.be.instanceof(Error);
                  done();
              });
            
            it("'compareSpec', should return Error if the spec is not valid",
              function(done) {
                  game.compareSpec('chorizo').should.be.instanceof(Error);
                  done();
              });
            
            it("'compareSpec', should return 1 if player1 wins",
              function(done) {
                  game.getPlayer1().getPlayingCard = sinon.stub().returns('4');
                  game.getPlayer2().getPlayingCard = sinon.stub().returns('1');
                  game.compareSpec('cilindrada').should.be.equal(1);
                  done();
              });

            it("'compareSpec', should return 2 if player2 wins",
              function(done) {
                  game.getPlayer1().getPlayingCard = sinon.stub().returns('1');
                  game.getPlayer2().getPlayingCard = sinon.stub().returns('4');
                  game.compareSpec('cilindrada').should.be.equal(2);
                  done();
              });

            it("'compareSpec', should return 0 if draw",
              function(done) {
                  game.getPlayer1().getPlayingCard = sinon.stub().returns('2');
                  game.getPlayer2().getPlayingCard = sinon.stub().returns('3');
                  game.compareSpec('cilindrada').should.be.equal(0);
                  done();
              });
            
            it("'player1Wins' should give the playing card from player 2 to player 1",
               function(done) {
                   var player1_total = game.getPlayer1().getDeck().length;
                   var player2_card = game.getPlayer2().getPlayingCard();
                   var player2_total = game.getPlayer2().getDeck().length;

                   game.player1Wins();

                   var player1_deck = game.getPlayer1().getDeck();
                   var player2_deck = game.getPlayer2().getDeck();

                   player1_deck.length.should.be.equal(player1_total + 1);
                   player1_deck.should.include(player2_card);

                   player2_deck.length.should.be.equal(player2_total - 1);
                   player2_deck.should.not.contain(player2_card);
                   done();
               });
            
            it("'player1Wins' and 'player2Wins' should switch the turn",
               function(done) {
                   game.player2Wins();
                   game.whoseTurn().should.be.equal(PLAYER_2_ID);
                   game.player1Wins();
                   game.whoseTurn().should.be.equal(PLAYER_1_ID);
                   done();
               });

            it("'player2Wins' should give the playing card from player 1 to player 2",
               function(done) {
                   var player1_total = game.getPlayer1().getDeck().length;
                   var player1_card = game.getPlayer1().getPlayingCard();
                   var player2_total = game.getPlayer2().getDeck().length;

                   game.player2Wins();

                   var player1_deck = game.getPlayer1().getDeck();
                   var player2_deck = game.getPlayer2().getDeck();

                   player1_deck.length.should.be.equal(player1_total - 1);
                   player1_deck.should.not.contain(player1_card);

                   player2_deck.should.include(player1_card);
                   player2_deck.length.should.be.equal(player2_total + 1);
                   done();
               });
        });
    });
});