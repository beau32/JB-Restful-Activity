'use strict';
var util = require( 'util' );
var fs = require('fs');
var axios = require('axios');
var Validator = require('jsonschema').Validator;

Validator.prototype.customFormats.getorpost = function(input) {
	return input === 'get' || input === 'post';
};

Validator.prototype.customFormats.retry = function(input) {

	return input.search(/^\d{1}\|\d{1,2}$/) != -1;
}

Validator.prototype.customFormats.url = function(input) {
	return input.length == 0 || input.search(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i) != -1;
};


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
		host: req.hostname,
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
	//console.log( req.body );
	//console.log( "------" );


	var inArguments =  req.body.inArguments;
	var json = {};
try {
	var val = Object.values(inArguments);
		for (var key of val){

			if (key.hasOwnProperty('call_body')){
				console.log(key.call_body);
				json.call_body = JSON.parse(key.call_body);
			}
			if (key.hasOwnProperty('call_retry')){
				json.call_retry = key.call_retry;
			}
			if (key.hasOwnProperty('auth_id')){
				json.auth_id = key.auth_id;
			}
			if (key.hasOwnProperty('auth_url')){
				json.auth_url = key.auth_url;
			}
			if (key.hasOwnProperty('auth_secret')){
				json.auth_secret = key.auth_secret;
			}
			if (key.hasOwnProperty('webhook')){
				json.webhook = key.webhook;
			}
			
		}


	console.log(json);
	console.log( "------" );
	var msg;

	axios(json.call_body)
		.then((ares) => {
				console.log('Status:', ares.status);
				console.log('Body: ', ares.data);
			if (json.webhook)
				axios({
				"method":"post",
				"url":json.webhook
			}).then((ares)=> {

				console.log('webhook: '+json.webhook)
				console.log('Status:', ares.status);
				console.log('Body: ', ares.data);

			});
			msg = 'OK';
		}).catch((err) => {
			console.error(err);
			msg = err;
		});
	
}catch(e){
		console.error(e);
		msg = e.message;

}
	res.status(200).send(msg);


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
	// Data from the req and put it in an array accessible to the main app, validated to ensure it has the right element to execute the call.
	var validator = new Validator();
	if (Object.keys( req.body.inArguments ).length<1) {
		res.status(200).send('Invalid InArguments');
		return;
	}
	
	var callbody_schema = {
		"id": "/axios",
		"type": "object",
		"properties":{
			"method": { type: "string", format: "getorpost"},
			"url": { type: "string", format: "url"},
			"data": {type: "object"}
		},
		"required": ["method","url"]
	};

	var schema = {
		"id": "/postvar",
		"type": "object",
		"properties":{
			"call_body": { "$ref": "/axios" },
			"call_retry": { type: "string", format: "retry" },
			"auth_url": {type: "string", format: 'url'},
			"auth_id": {type: "string", "minLength": 1},
			"auth_secret": {type: "string", "minLength": 1},
			"webhook": {type:"string", format: 'url'}
		},
		"required": ["call_body","call_retry"],
		"dependencies": {
			"auth_url": ["auth_id", "auth_secret"]
		}

	}
	validator.addSchema(callbody_schema, '/axios');

	try {
		console.log(req.body.inArguments);
		var val = Object.values(req.body.inArguments);
		var json = {};
		
		for (var key of val){

			if (key.hasOwnProperty('call_body')){
				console.log(key.call_body);
				json.call_body = JSON.parse(key.call_body);
			}
			if (key.hasOwnProperty('call_retry')){
				json.call_retry = key.call_retry;
			}
			if (key.hasOwnProperty('auth_id')){
				json.auth_id = key.auth_id;
			}
			if (key.hasOwnProperty('auth_url')){
				json.auth_url = key.auth_url;
			}
			if (key.hasOwnProperty('auth_secret')){
				json.auth_secret = key.auth_secret;
			}
			if (key.hasOwnProperty('webhook')){
				json.webhook = key.webhook;
			}	
		}


		var result = validator.validate(json, schema);
		var msg = '';

		if (result.errors.length!=0){
			msg = result.errors.map(function(err){
				return err.stack;
			});
		}else{
			msg ="OK";
		}
		logData( req );

		console.log(msg);
	}catch (e){
		console.log(e);
		msg = e.message;
	}

	res.status(200).send(msg);
};
