'use strict';

// Deps
var activity = require('./activity');
var appstr = Math.random() * (11000 - 10000) + 10000;


var axios = require('axios');
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

exports.fireEvent = (req,res) =>  {

    axios({
        // make a POST request
        method: "post",
        url: `https://${req.body.sfdomain}.auth.marketingcloudapis.com/v2/token`,
        // Set the content type header, so that we get the response in JSON
        headers: {
            "Content-Type": "application/json",
            'accept': "application/json",
        },
        data: {
            'grant_type': 'client_credentials',
            'client_id': req.body.clientid,
            'client_secret': req.body.clientsecret
        },
      }).then((response) => {
        console.log(response.data);

        // redirect the user to the welcome page, along with the access token
        axios({
            method: 'post',
            url: `https://${req.body.sfdomain}.rest.marketingcloudapis.com/interaction/v1/events`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/JSON",
                "Authorization": 'Bearer ' + response.data.access_token
            },
            data:req.body.eventbody
        }).then((response)=> {
            console.log('Success')
            console.log(response.data);
            return res.status(200).send({'stats': 'OK','eventid':response.data.eventInstanceId});
        }).catch((error)=>{
            console.log('Rest');
            console.log(error);
            return res.status(400).send({'error':error});
        });
      }).catch((error)=>{
        console.log('Oauth');
        console.log(error);
        return res.status(400).json(error);
    });
};