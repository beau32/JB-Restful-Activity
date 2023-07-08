'use strict';

// Deps
var activity = require('./activity');
var appstr = Math.random() * (11000 - 10000) + 10000;
/*
 * GET home page.
 */
exports.index = function(req, res){

    if( !req.session.token ) {
        res.render( 'index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via the Marketing Cloud',
        });
    } else {
        res.render( 'index', {
            title: 'JB Custom Activity',
            results: activity.logExecuteData,
        });
    }
};

exports.login = function( req, res ) {
    console.log( 'req.body: ', req.body );
    req.session.token = appstr;
    res.redirect( '/' );
};

exports.logout = function( req, res ) {
    req.session.token = '';
};
