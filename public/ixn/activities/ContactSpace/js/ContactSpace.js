define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';
	var Postmonger = require( 'postmonger' );
	var $ = require( 'vendor/jquery.min' );

    var connection = new Postmonger.Session();
    var payload = {};
	var tokens;
	var endpoints;
	var vdata = {};
	var uiPayload ={};

    $(window).ready(function() {
        connection.trigger('ready');
        console.log('ready');
    })

	// Journey Builder broadcasts this event to us after this module
	// sends the "ready" method. JB parses the serialized object which
	// consists of the Event Data and passes it to the
	// "config.js.save.uri" as a POST
    connection.on('initActivity', function(data) { 
    	console.log('initActivity');
    	console.log(data);

    	if(data['arguments'].execute.inArguments.length>0){
    		$('#call_url').val( data.['arguments'].execute.inArguments.call_url );
        	$('#call_body').val( data.['arguments'].execute.inArguments.call_body );
    	}

    	if (data) {
            payload = data;
        }

    });

    connection.on('clickedNext', function(options) {


    	console.log('clickedNext');

    	var urlvalue = $('#call_url').val();
    	var bodyvalue = $('#call_body').val();

        if( !urlvalue ) {
        	console.log('empty value');
            // Notify user they need to select a value 
            $('#helloWorldTriggerConfigError').html('<strong style="color: red;">You must enter something</strong>');
            connection.trigger('ready');
        } else {

            // Successful change
            // When we're all done, define our payload
            vdata = {
                url: urlvalue,
                body: bodyvalue
            };

           	payload.name = 'ContactSpace';
	        payload['arguments'].execute.inArguments = [{ "call_url": urlvalue },{ "call_body": bodyvalue }];
	        payload['metaData'].isConfigured = true;
	        connection.trigger('updateActivity', payload);

            
            connection.trigger('nextStep');
            
        }

    });


    //connection.trigger('updateButton', { button: 'next', enabled: false });

    connection.on('populateFields', function(options) {
    	console.log('populateFields');

    	if( options ) {
            //console.log( 'OPTIONS: ', options );
            // Persist
            $('#call_url').val( options.call_url );
            $('#call_body').val( options.call_body );
        }

    });

});
