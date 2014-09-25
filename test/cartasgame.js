/* jshint -W030 */

var config = require('../config'),
    chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();
var io = require('socket.io-client');
describe("cartasDe socket API functions.", function() {
        var server,
            options = {
                transports: ['websocket'],
                'force new connection': true
            },
            gameId,
            client,
            client2;
        before(function(done) {
            done();
        });
        beforeEach(function(done) {
            done();
        });
		describe("on game creation (hostCreateNewGame)", function() {
			before(function(done) {
				server = require('../server').server;
            client = io.connect(config.server_url, options);
				done();
			});
			after(function() {
                client.disconnect();
                if(typeof client2 !== 'undefined') client2.disconnect();
            });

			it("should respond with Error if client id is not provided", function(done) {
				client.once("connect", function() {
					client.once("cartasDeError", function(data) {
						data.message.should.equal('user id must be provided');
						done();
					});
					var data = {
						userId: ""
					};
					client.emit("hostCreateNewGame", data);
				});
			});
		});
        describe("if game created", function() {
            before(function(done) {
				server = require('../server').server;
            client = io.connect(config.server_url, options);
				client.once("connect", function() {
					client.once("newGameCreated", function(data) {
                    gameId = data.gameId;
                    done();
					});
					var data = {
						userId: "player1Id"
					};
					client.emit("hostCreateNewGame", data);
                });
            });
			after(function() {
                client.disconnect();
                if(typeof client2 !== 'undefined') client2.disconnect();
            });
            it("should respond with a new game id on 'hostCreateNewGame'", function(done) {
                gameId.should.exist;
				done();
            });
            it("should respond with an error when connecting to not existing game", function(done) {
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
        });

		describe("if game is ready", function() {
			var player1Ready = false;
			var player2Ready = false;
			before(function(done) {
				server = require('../server').server;
            client = io.connect(config.server_url, options);
				client.once("connect", function() {

					client.once("newGameCreated", function(data) {

						client.once("gameReady", function(data) {
							player1Ready = true;
						});

            gameId = data.gameId;
						var joinData = {
							gameId: gameId
						};
						client2 = io.connect(config.server_url, options);
						client2.once("connect", function() {
							client2.once("gameReady", function(data) {
								player2Ready = true;
								done();
							});

							client2.emit("hostJoinGame", joinData);
						});

					});

					var data = {
						userId: "player1Id"
					};

					client.emit("hostCreateNewGame", data);
                });
			});
			after(function() {
				client.disconnect();
				if(typeof client2 !== 'undefined') client2.disconnect();
			});

			it("should emit 'gameReady' to both players when connecting to an existing game", function(done) {
				player1Ready.should.be.true;
				player2Ready.should.be.true;
				done();
			});
			it("should emit 'cartasDeError' on 'hostSendSpec' if playerId is not provided", function(done) {
				client.once("cartasDeError", function(data) {
					data.message.should.equal('player not found');
					done();
				});
				var data = {
					gameId: gameId,
					specName: "cilindrada",
					//specValue: "500"
				};
				client.emit("hostSendSpec", data);
			});
			it("should emit 'cartasDeError' on 'hostSendSpec' if playerId does not correspond to a player", function(done) {
				client.once("cartasDeError", function(data) {
					data.message.should.be.equal('not your turn');
					done();
				});
				var data = {
					gameId: gameId,
					playerId: "unknownPlayer",
					specName: "cilindrada",
					//specValue: "500"
				};
				client.emit("hostSendSpec", data);
			});
			it("should emit 'cartasDeError' on 'hostSendSpec' if it's not players turn", function(done) {
				client.once("cartasDeError", function(data) {
					data.message.should.be.equal('not your turn');
					done();
				});
				var data = {
					gameId: gameId,
					playerId: "player2Id",
					specName: "cilindrada",
					//specValue: "500"
				};
				client.emit("hostSendSpec", data);
			});
			it("should emit 'cartasDeError' on 'hostSendSpec' if game is not provided", function(done) {
				client.once("cartasDeError", function(data) {
					data.message.should.be.equal('game not found');
					done();
				});
				var data = {
					playerId: "",
					specName: "cilindrada",
					//specValue: "500"
				};
				client.emit("hostSendSpec", data);
			});
			it("should emit 'cartasDeError' on 'hostSendSpec' if game is not provided",
					function(done) {
				client.once("cartasDeError", function(data) {
					data.message.should.equal('game not found');
					done();
				});
				var data = {
					playerId: "",
					specName: "cilindrada",
					//specValue: "500"
				};
				client.emit("hostSendSpec", data);
			});
			it("should emit 'cartasDeError' both clientssends an invalid spec",
					function(done) {
				client.once("cartasDeError", function(data) {
					data.message.should.equal('invalid specification provided');
					done();
				});
				var data = {
					gameId: gameId,
					playerId: 'player1Id',
					specName: 'unknownSpec'
				};
				client.emit("hostSendSpec", data);
			});
			it("should emit 'youWin' to client1 and 'youLoose' to client2 when client1 sends a spec", function(done) {

				client.once("youWin", function() {
					client2.once("youLoose", function() {
						done();
					});
				});

				client.once("youLoose", function() {
					client2.once("youWin", function() {
						done();
					});
				});
				var data = {
					gameId: gameId,
					playerId: 'player1Id',
					specName: "cilindrada"
					//specValue: "500"
				};
				client.emit("hostSendSpec", data);
			});
		});
});
