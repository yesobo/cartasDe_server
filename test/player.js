/* jshint -W030 */

var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should(),
    expect = chai.expect,
    player_module = require('../player');

describe("Player object", function() {

    var Player,
        player;
    
    before(function(done) {
        Player = player_module.Player;
        player = new Player('yesobo');
        done();
    });
    
    it("constructor should return an Error if the player id is not provided",
       function(done) {
           var player2 = new Player();
           player2.should.be.instanceof(Error);
           done();
       });

    it("constructor should create a Player with an empty deck",
       function(done) {
           player.getDeck().should.be.instanceof(Array);
           player.getDeck().should.have.length(0);
           done();
       });

    it("'getId' should return the player id",
       function(done) {
           player.getId().should.be.equal("yesobo");
           done();
       });

    it("'playingCard' function should return 'undefined' if deck is empty",
       function(done) {
           player.getDeck().should.have.length(0);
           var playingCard = player.getPlayingCard();
           expect(playingCard).to.be.undefined;
           player.getDeck().should.have.length(0);
           done();
       });

    it("'setInitCards' function should set the player's cards",
       function(done) {
           player.setInitCards(['1', '2', '3']);
           var deck = player.getDeck();
           deck.should.be.instanceof(Array);
           deck.should.have.length(3);
           done();
       });

    it("'playingCard' function should return the current card",
       function(done) {
           var prevLength = player.getDeck().length;
           var card = player.getPlayingCard();
           card.should.be.equal('1');
           player.getDeck().should.have.length(prevLength);
           done();
       });


    it("'win' function should add a card to the winner and change the playing card",
       function(done) {
           player.setInitCards(['1', '2', '3']);
           player.win('4');
           var deck = player.getDeck();
           deck.should.have.length(4);
           player.getPlayingCard().should.be.equal('2');
           done();
       });

    it("'win' function should'nt add a card if it's not provided",
       function(done) {
           var prevLength = player.getDeck().length;
           var prevPlayingCard = player.getPlayingCard();
           player.win();
           var deck = player.getDeck();
           deck.should.be.instanceof(Array);
           deck.should.have.length(prevLength);
           player.getPlayingCard().should.be.equal(prevPlayingCard);
           done();
       });

    it("'loose' function should remove the playing card from player's deck",
       function(done) {
           player.setInitCards(['1', '2', '3']);
           var lostCard = player.loose();
           player.getDeck().should.have.length(2);
           player.getPlayingCard().should.be.equal('2');
           done();
       });
});