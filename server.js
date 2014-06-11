//server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.OPENSHIFT_NODEJS_PORT;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;

if (typeof port === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
	port = "3000";
    console.warn('No OPENSHIFT_NODEJS_PORT var, using ' + port);
};

if (typeof ipaddress === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
	ipaddress = "172.17.0.5";
    console.warn('No OPENSHIFT_NODEJS_IP var, using ' + ipaddress);
};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
//app.listen(port); //codio
app.listen(port, ipaddress); // openshift
console.log('Magic happens on port ' + port);