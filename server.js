//server.js

// BASE SETUP
// =============================================================================

// call the packages we need
// npm modules
var express = require('express');
var app = express(); // define our app using express
var server = exports.server = require('http').Server(app);
var io = require('socket.io')(server, {origins:'*'});

// cartasDe Game module
var cartasDe = require('./cartasgame.js');

//var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser());

var port = process.env.OPENSHIFT_NODEJS_PORT;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;

if (typeof port === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
		port = "3000";
    console.warn('No OPENSHIFT_NODEJS_PORT var, using ' + port);
}

if (typeof ipaddress === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var');
}

// START THE SERVER
// =============================================================================
if (typeof ipaddress === "undefined") {
	server.listen(port);
} else {
    server.listen(port, ipaddress);
}

/*

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('*', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

*/

/*
app.get('*', function(req, res) {
	console.log('get * received');
  res.header("Access-Control-Allow-Origin", "*");
});
*/

app.use('/test/', express.static(__dirname + '/client'));
app.get('/', function (req, res) {
	res.send("CartesDe server is working");
});

// SOCKET.IO SET UP -------------------------------
io.set( 'origins', '*:*' );

io.on('connection', function(socket) {
  console.log('conection stablished');
  cartasDe.initGame(io, socket);
});

console.log('Listening on port: ' + port);
