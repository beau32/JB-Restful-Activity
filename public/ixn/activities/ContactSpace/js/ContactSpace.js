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

	// Journey Builder broadcasts this event to us after this module
	// sends the "ready" method. JB parses the serialized object which
	// consists of the Event Data and passes it to the
	// "config.js.save.uri" as a POST
    connection.on('initActivity', function(payload) { 
    	console.log('initActivity');
    	console.log(payload);
    });

    connection.on('populateFields', function(options) {
    	console.log('populateFields');

    	if( options ) {
            //console.log( 'OPTIONS: ', options );
            // Persist
            $('#call_url').val( options.call_url );
            $('#call_body').val( options.call_body );
        }

    });

	// Trigger this method when updating a step. This allows JB to
	// update the wizard.
    connection.trigger('updateSteps', function(step){
    	
    	console.log('updateSteps');
    	var urlvalue = $('#call_url').val();
    	var bodyvalue = $('#call_body').val();

        if( !urlvalue || !bodyvalue ) {
        	console.log('empty value');
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
            console.log('uiPayload: ', uiPayload);
            connection.trigger('save', uiPayload);
            //connection.trigger( 'save', uiPayload );
        }
    });

	// When everything has been configured for this activity, trigger
	// the save:
	// connection.trigger('save', 
});
