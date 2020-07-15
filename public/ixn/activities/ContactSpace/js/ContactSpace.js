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
    	console.log(payload);
    	var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        if (hasInArguments){
        	var values = payload['arguments'].execute.inArguments.filter(function( obj ) {
				return obj.field == 'call_url' || obj.field == 'call_body';
			});
        }
        console.log(values);

    	$('#call_url').val( values.call_url );
        $('#call_body').val( values.vcall_body );
    	

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

        	myArray = payload['arguments'].execute.inArguments.filter(function( obj ) {
			    return obj.field !== 'call_url' || obj.field !== 'call_body';
			});

           	payload.name = 'ContactSpace';
	        payload['arguments'].execute.inArguments.push({ "call_url": urlvalue })
	        payload['arguments'].execute.inArguments.push({ "call_body": bodyvalue  })
	        
	        payload['metaData'].isConfigured = true;
	        connection.trigger('updateActivity', payload);

            
            connection.trigger('nextStep');
            
        }

    });


    //connection.trigger('updateButton', { button: 'next', enabled: false });


});
