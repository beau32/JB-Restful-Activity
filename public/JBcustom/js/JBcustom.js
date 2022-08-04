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
				return obj.hasOwnProperty('call_url') || obj.hasOwnProperty('call_body') || obj.hasOwnProperty('call_retry') || obj.hasOwnProperty('auth_url') || obj.hasOwnProperty('auth_id') || obj.hasOwnProperty('auth_secret');
			});
        }

        console.log(values);

        if (values && values.length>0){
        	$('#call_url').val( values[0].call_url );
        	$('#call_body').val( values[1].call_body );
		$('#call_retry').val( values[2].call_retry );
                $('#auth_url').val( values[3].auth_url );
                $('#auth_id').val( values[4].auth_id );
                $('#auth_secret').val( values[5].auth_secret );
        }
    	
    	

    });

    connection.on('clickedNext', function(options) {


    	console.log('clickedNext');

    	var urlvalue = $('#call_url').val();
    	var bodyvalue = $('#call_body').val();
	var client_id = $('#auth_id').val();
	var call_retry = $('#call_retry').val();
	var client_secret = $('#auth_secret').val();;

        connection.trigger('ready');
        
	if( !bodyvalue ) {
        	console.log('empty body value');
            // Notify user they need to select a value 
            	$('#TriggerConfigError').html('<strong style="color: red;">Request Body Cannot be Empty</strong>');
        } else {

	payload['arguments'].execute.inArguments = payload['arguments'].execute.inArguments.filter(function( obj ) {
				return obj.hasOwnProperty('call_url') || obj.hasOwnProperty('call_body') || obj.hasOwnProperty('call_retry') || obj.hasOwnProperty('auth_url') || obj.hasOwnProperty('auth_id') || obj.hasOwnProperty('auth_secret');
			});

           	if (!payload.name) payload.name = 'JBCustom';
	        payload['arguments'].execute.inArguments.push({ "call_url": urlvalue });
	        payload['arguments'].execute.inArguments.push({ "call_body": bodyvalue  });
		payload['arguments'].execute.inArguments.push({ "call_retry": retry  });
		payload['arguments'].execute.inArguments.push({ "auth_id": auth_id  });
		payload['arguments'].execute.inArguments.push({ "auth_secret": auth_secret  });
		payload['arguments'].execute.inArguments.push({ "auth_url": auth_url  });
		
	        
	        payload.metaData.isConfigured = true;

	        console.log(payload);
	        
	        connection.trigger('updateActivity', payload);
            connection.trigger('nextStep');
            
        }

    });


    //connection.trigger('updateButton', { button: 'next', enabled: false });


});
