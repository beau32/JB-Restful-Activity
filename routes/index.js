'use strict';

// Deps
var activity = require('./activity');
var appstr = "3120816230";
/*
 * GET home page.
 */
exports.index = function(req, res){
    if( !req.session.token ) {
        res.render( 'index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via the ExactTarget Marketing Cloud',
        });
    } else {
        res.render( 'index', {
            title: 'Hello World Custom Interaction Example',
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
