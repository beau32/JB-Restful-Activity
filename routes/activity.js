'use strict';
var util = require( 'util' );
var fs = require('fs');
var axios = require('axios');

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

    console.log('Log Saved');
       
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );

    logData( req );
    res.status(200).send('edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );

    logData( req );
    res.status(200).send('Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );

    var call_body = req.body.inArguments[0].call_body;

    axios(call_body)
        .then((ares) => {
            console.log('Status:', ares.status);
            console.log('Body: ', ares.data);
            res.status(200).send(JSON.stringify(ares.data));

        }).catch((err) => {
            console.error(err);
            res.status(200).send(ares.data);
    });
    res.status(200).send('execute');
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData( req );
    res.status(200).send('Publish');
    
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData( req );
    res.status(200).send('Validate');
    
};
