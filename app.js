'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var path        = require('path');
var routes      = require('./routes');
var activity    = require('./routes/activity');

var jwt = require('./lib/jwtDecoder.js');
var logger  = require('winston');
var methodOverride  = require('method-override')
var favicon = require('serve-favicon')
var errorHandler = require('errorhandler') 
var cookieSession = require('cookie-session');

var app = express();

const configJSON = require('./config-json');
app.use(cookieSession({secret: "JBCustom-CookieSecret"}));

// Configure Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride());
//app.use(favicon());
//app.use(app.router);
app.use(express.static('public'))

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorHandler());
}
//JWT Verification
app.use(function(req, res, next){
  var options = {
    //appSignature: process.env.JWTSIGNINGSECRET
  }
  //JwtDecoder(options);
  //jwt.JwtDecoder.decode(req);
})
// HubExchange Routes
app.get('/', routes.index );
app.get('/login', routes.login );
app.get('/logout', routes.logout );

app.post('/JBcustom/save/', activity.save );
app.post('/JBcustom/edit/', activity.edit );
app.post('/JBcustom/validate/', activity.validate );
app.post('/JBcustom/publish/', activity.publish );
app.post('/JBcustom/execute/', activity.execute );


app.get('/config.json', function(req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.status(200).json(configJSON(req));
});

app.listen(app.get('port'),function (parent) {
  console.log('Express server listening on port ' + app.get('port'));
});


