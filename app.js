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
var logger  = require('express-logger');
var cookieParser = require('cookie-parser');
var sstatic = require('serve-static')
var methodOverride  = require('method-override')
var favicon = require('serve-favicon')
var errorHandler = require('errorhandler') 
var cookieSession = require('cookie-session');
var url = require('url');
var axios = require('axios');

var app = express();

// Use the cookie-based session  middleware
app.use(cookieParser());

// TODO: MaxAge for cookie based on token exp?
app.use(cookieSession({secret: "HelloWorld-CookieSecret"}));

// Configure Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride());
//app.use(favicon());
//app.use(app.router);
app.use(sstatic(path.join(__dirname, 'public')));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// HubExchange Routes
app.get('/', routes.index );
app.get('/login', routes.login );
app.get('/logout', routes.logout );

// Custom Hello World Activity Routes
app.post('/ixn/activities/ContactSpace/save/', activity.save );
app.post('/ixn/activities/ContactSpace/edit/', activity.edit );
app.post('/ixn/activities/ContactSpace/validate/', activity.validate );
app.post('/ixn/activities/ContactSpace/publish/', activity.publish );
app.post('/ixn/activities/ContactSpace/execute/', activity.execute );

// Abstract Event Handler
app.post('/fireEvent/:type', function( req, res ) {

    var call_body = null;
    var call_url = url.parse(req.body.call_url);

    if(req.body.call_body)
        var call_body = req.body.call_body;
        
    console.log(call_url.href);

    axios.post(call_url.href,call_body)
        .then((ares) => {
            console.log('Status:', ares.status);
            console.log('Body: ', ares.data);
            res.status(200).send(JSON.stringify(ares.data));

        }).catch((err) => {
            console.error(err);
            res.status(200).send(err.response.data);
    });

});

app.get('/clearList', function( req, res ) {
	// The client makes this request to get the data
	activity.logExecuteData = [];
    res.status(200).send('Cleared');
	
});


// Used to populate events which have reached the activity in the interaction we created
app.get('/getActivityData', function( req, res ) {
	// The client makes this request to get the data
	if( !activity.logExecuteData.length ) {
		res.send( 200, {data: null} );
	} else {
		res.send( 200, {data: activity.logExecuteData} );
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
