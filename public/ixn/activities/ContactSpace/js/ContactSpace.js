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
	$('#oauth').change(function(){
                $('#oautharea').toggle();
	});

    })

	// Journey Builder broadcasts this event to us after this module
	// sends the "ready" method. JB parses the serialized object which
	// consists of the Event Data and passes it to the
	// "config.js.save.uri" as a POST
    	connection.on('initActivity', function(data) { 
    		console.log('initActivity');
    		console.log(data);

    	if (data) {
            payload = data;
        }

    	var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );
    	var values;

        if (hasInArguments){
        	values = payload['arguments'].execute.inArguments.filter(function( obj ) {
				return obj.hasOwnProperty('call_url') || obj.hasOwnProperty('call_body');
			});
        }

        console.log(values);

        if (values && values.length>0){
        	$('#call_url').val( values[0].call_url );
        	$('#call_body').val( values[1].call_body );
		$('#call_retry').val( values[2].call_url );
                $('#auth_url').val( values[3].call_body );
                $('#auth_id').val( values[4].call_url );
                $('#auth_secret').val( values[5].call_body );
        }
    	
    	

    });

    connection.on('clickedNext', function(options) {


    	console.log('clickedNext');

    	var urlvalue = $('#call_url').val();
    	var bodyvalue = $('#call_body').val();

        if( !urlvalue ) {
        	console.log('empty value');
            // Notify user they need to select a value 
            $('#TriggerConfigError').html('<strong style="color: red;">You must enter something</strong>');
            connection.trigger('ready');
        } else {

        	payload['arguments'].execute.inArguments = payload['arguments'].execute.inArguments.filter(function( obj ) {
			    return !obj.hasOwnProperty('call_url') && !obj.hasOwnProperty('call_body');
			});


           	if (!payload.name) payload.name = 'ContactSpace';
	        payload['arguments'].execute.inArguments.push({ "call_url": urlvalue });
	        payload['arguments'].execute.inArguments.push({ "call_body": bodyvalue  });
	        
	        payload.metaData.isConfigured = true;

	        console.log(payload);
	        
	        connection.trigger('updateActivity', payload);
            connection.trigger('nextStep');
            
        }

    });


    //connection.trigger('updateButton', { button: 'next', enabled: false });


});
