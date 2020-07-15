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
    connection.on('initActivity', function(data) { 
    	console.log('initActivity');

    	if (data) {
            payload = data;
        }

    	console.log("payload",payload);
    });
    connection.on('clickedNext', function(options) {
    	console.log('clickedNext');
    });
    connection.trigger('updateButton', { button: 'next', enabled: false });
    
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
    connection.trigger('updateStep', function(step){
    	
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
            connection.trigger('updateActivity', uiPayload);
            //connection.trigger( 'save', uiPayload );
        }
    });

	function save() {
        var call_body = $('#call_body').val();
        var call_url = $('#call_url').val();

        var value = getMessage();

        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
        payload.name = name;

        payload['arguments'].execute.inArguments = [{ "message": value }];

        payload['metaData'].isConfigured = true;

        connection.trigger('updateActivity', payload);
    }
});
