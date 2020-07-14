define( function( require ) {
	var Postmonger = require( 'postmonger' );
	var $ = require( 'vendor/jquery.min' );

    var connection = new Postmonger.Session();
    var payload = {};
	var tokens;
	var endpoints;

    $(window).ready(function() {
        connection.trigger('ready');
    })

    function initialize (data) {
        if (data) {
            payload = data;
        }
    }

	// This listens for Journey Builder to send tokens
	// Parameter is either the tokens data or an object with an
	// "error" property containing the error message
	connection.on('getTokens', function( data ) {
		if( data.error ) {
			console.error( data.error );
		} else {
			tokens = data;
		}
	});

	/**
		If you want to have a multi-step configuration view, you need to manage the DOM manually.
		You can filter what changes to make by implementing the following type of logic when Postmonger from the server triggers an "updateStep" call.
		// connection.on('updateStep', step ) {

			if( step  >= 1 && step <= 3 ) {
				$('.step').hide(); // All DOM elements which are steps should have this class (this hides them all)
				$('#step' + step ).show(); // This selectively only displays the current step
				// Allow the user to make any changes and when you're ready, use:
				connection.trigger( 'updateStep', step ); 
			}
		}
	**/

	// This listens for Journey Builder to send endpoints
	// Parameter is either the endpoints data or an object with an
	// "error" property containing the error message
	connection.on('getEndpoints', function( data ) {
		if( data.error ) {
			console.error( data.error );
		} else {
			endpoints = data;
		}
	});

    connection.on('requestPayload', function() {
	 var payload = {};
 
        payload.options = {
           
        };

		//TODO: Shouldn't this come from the data?
        //payload.flowDisplayName = 'Hello World';
 
        connection.trigger('getPayload', payload);
    });

	// Journey Builder broadcasts this event to us after this module
	// sends the "ready" method. JB parses the serialized object which
	// consists of the Event Data and passes it to the
	// "config.js.save.uri" as a POST
    connection.on('populateFields', function(options) {
    	console.log( 'OPTIONS: ', options );
    	if( options ) {
            //console.log( 'OPTIONS: ', options );
            // Persist
            $('#call_url').val( options.url );
            $('#call_body').val( options.body );
        }

    });

	// Trigger this method when updating a step. This allows JB to
	// update the wizard.
    connection.trigger('updateStep', function(step){
    	console.log(step);

    	var urlvalue = $('#call_url').val();
    	var bodyvalue = $('#call_body').val();

        if( !urlvalue || !bodyvalue ) {
            // Notify user they need to select a value 
            $('#helloWorldTriggerConfigError').html('<strong style="color: red;">You must enter something</strong>');
        } else {
            // Successful change
            // When we're all done, define our payload
            data = {
                url: urlvalue,
                body: bodyvalue
            };

            uiPayload = {
                options: data,
                description: 'This is a configuration instance.'
            };
            connection.trigger('updateActivity', uiPayload);
            //connection.trigger( 'save', uiPayload );
        }
    });

	// When everything has been configured for this activity, trigger
	// the save:
	// connection.trigger('save', 
});
