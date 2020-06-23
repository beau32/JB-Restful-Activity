'use strict';
var util = require( 'util' );
const https = require('https');
var fs = require('fs');

exports.logExecuteData = [];

function logData( req ) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
        console.log( "body: " + util.inspect( req.body ) );
        console.log( "headers: " + req.headers );
        console.log( "trailers: " + req.trailers );
        console.log( "method: " + req.method );
        console.log( "url: " + req.url );
        console.log( "params: " + util.inspect( req.params ) );
        console.log( "query: " + util.inspect( req.query ) );
        console.log( "route: " + req.route );
        console.log( "cookies: " + req.cookies );
        console.log( "ip: " + req.ip );
        console.log( "path: " + req.path );
        console.log( "host: " + req.host );
        console.log( "fresh: " + req.fresh );
        console.log( "stale: " + req.stale );
        console.log( "protocol: " + req.protocol );
        console.log( "secure: " + req.secure );
        console.log( "originalUrl: " + req.originalUrl );
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );

    fs.readFile('helloworld.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });

};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    
    fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });

    logData( req );
    res.send( 200, 'Save' );
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );


    const https = require('https');

    https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(JSON.parse(data).explanation);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    }).on("complete", (err) => {
        logData( req );
        res.send( 200, 'Execute' );
    });
    
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData( req );
    res.send( 200, 'Validate' );
};
