requirejs.config({
	"baseUrl": "vendor",
    paths: {
        vendor: '../vendor',
		postmonger: 'postmonger'
    },
    shim: {
        'jquery.min': {
            exports: '$'
        },
		'JBcustom': {
			deps: ['jquery.min', 'jquery.textcomplete.min', 'postmonger']
		}
    }
});

requirejs( ['jquery.min','jquery.textcomplete.min','../js/JBcustom'], function( $, JBcustom ) {
	console.log( 'REQUIRE LOADED' );
	
		$('.autocomplete-textarea').textcomplete([
			{
			// #3 - Rgular experession used to trigger search
			match: /(^|\s)\{\{(\w*(?:\s*\w*))$/,

			// #4 - Function called at every new keystroke
			search: function(word, callback) {
				var l = [
				'InArguments',
				'InArguments.call_body',
				'InArguments.call_url',
				'InArguments.call_retry',
				'InArguments.auth_url',
				'InArguments.auth_id',
				'InArguments.auth_secret',
				'InArguments.pre_script',
				'InArguments.post_script',
				'OutArguments',
				'Contact',
				'Contact.ID',
				'Contact.FirstName',
				'Contact.LastName',
				'Contact.Key',
				'Contact.Default',
				'Contact.Attribute',
				'Contact.Attribute.Person.FirstName',
				'Contact.Attribute.Person.LastName',
				'InteractionDefaults',
				'InteractionDefaults.Email',
				'Context.IsTest',
				'Context.PublicationId',
				'Context.DefinitionId',
				'Context.DefinitionInstanceId',
				'Context.StartActivityKey',
				'Context.VersionNumber',
				'Event'
				]
				callback($.map(l, function (word) {
					return word.indexOf(word) === 0 ? word : null;
				}));
			},

			// #6 - Template used to display the selected result in the textarea
			replace: function (hit) {
				return ' {{' + hit + '}}';
			}
			}])

});

requirejs.onError = function( err ) {
	console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};
