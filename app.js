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

app.use(cookieSession({secret: "JBCustom-CookieSecret"}));

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

app.post('/JBcustom/save/', activity.save );
app.post('/JBcustom/edit/', activity.edit );
app.post('/JBcustom/validate/', activity.validate );
app.post('/JBcustom/publish/', activity.publish );
app.post('/JBcustom/execute/', activity.execute );

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


