var config = require('../config'),
    chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');

describe("echo", function() {
  var server,
    options = {
      transports: ['websocket'],
      'force new connection': true
    },
    gameId,
    client,
    client2;

  before(function(done) {
    //start the server
    server = require('../server').server;
    done();
  });

  beforeEach(function(done) {
    done();
  });

  it("should respond with a new game id on 'hostCreateNewGame'",
    function(done) {

    client = io.connect(config.server_url, options);
    client.once("connect", function() {
      client.once("newGameCreated", function(data) {
        gameId = data.gameId;
        gameId.should.be.a('number');

        //client.disconnect();
        done();
      });

      client.emit("hostCreateNewGame");
    });
  });

  it("should respond with an error when connecting to not existing game",
    function(done) {

    client2 = io.connect(config.server_url, options);
    client2.once("connect", function() {
      client2.once("cartasDeError", function(data) {
        data.message.should.equal('game not found');
        //client.disconnect();
        done();
      });

      var data = {
        gameId: '12345'
      };

      client2.emit("hostJoinGame", data);
    });
  });

  it("should emit 'gameReady' to both players when connecting to an existing game",
    function(done) {

    client.once("gameReady", function(data) {
      should.exist('true');

      client2.once("gameReady", function(data) {
        should.exist('true');
        done();
      });
    });

    var data = {
      gameId: gameId
    };

    client2.emit("hostJoinGame", data);
  });

  it("should emit 'youWin' to client1 and 'youLoose' to client2 when client1 sends a spec",
    function(done) {

    client.once("youWin", function() {
      should.exist('true');

      client2.once("youLoose", function() {
        should.exist('true');
        done();
      });
    });

    var data = {
      gameId: gameId,
      //playerId: playerId,
      specName: "cilindrada",
      specValue: "500"
    };
    client.emit("hostSendSpec", data);
  });

  after(function() {
    client.disconnect();
    client2.disconnect();
  })

});
