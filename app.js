'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var http        = require('http');
var https        = require('https');
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var activity    = require('./routes/activity');

var connect = require('connect');
var logger  = require('winston');
var cookieParser = require('cookie-parser');
var methodOverride  = require('method-override')
var favicon = require('serve-favicon')
var errorHandler = require('errorhandler') 
var cookieSession = require('cookie-session');
var url = require('url');
var axios = require('axios');

var app = express();

const configJSON = require('./config-json');
console.log(configJSON);
// Use the cookie-based session  middleware
app.use(cookieParser());

// TODO: MaxAge for cookie based on token exp?
app.use(cookieSession({secret: "JBCustom-CookieSecret"}));

// Configure Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(methodOverride());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// HubExchange Routes
app.get('/', routes.index );
app.get('/login', routes.login );
app.get('/logout', routes.logout );

// Custom Hello World Activity Routes
app.post('/JBcustom/save/', activity.save );
app.post('/JBcustom/edit/', activity.edit );
app.post('/JBcustom/validate/', activity.validate );
app.post('/JBcustom/publish/', activity.publish );
app.post('/JBcustom/execute/', activity.execute );

app.get('/clearList', function( req, res ) {
	// The client makes this request to get the data
	activity.logExecuteData = [];
	res.status(200).send('Cleared');
	
});


// Used to populate events which have reached the activity in the interaction we created
app.get('/getActivityData', function( req, res ) {
	// The client makes this request to get the data
	if( !activity.logExecuteData.length ) {
		res.status(200).send( {data: "No Found"} );
	} else {
		res.status(200).send( {data: activity.logExecuteData[activity.logExecuteData.length-1]} );
	}
});
app.get('/config.json', function(req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.status(200).json(configJSON(req));
});

app.listen(app.get('port'),function (parent) {
  console.log('Express server listening on port ' + app.get('port'));
});

