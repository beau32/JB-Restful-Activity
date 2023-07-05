requirejs.config({
	"baseUrl": "js/",
    paths: {
		postmonger: 'vendor/postmonger'
    },
    shim: {
        'vendor/jquery.min': {
            exports: '$'
        },
		'vendor/jquery.textcomplete.min':{

		},
		'vendor/codeflask.js':{
			
		},
		'JBcustom': {
			deps: ['vendor/jquery.min', 'vendor/jquery.textcomplete.min', 'vendor/postmonger']
		}
    }
});

requirejs( ['JBcustom'], function( JBcustom ) {
	console.log( 'REQUIRE LOADED' );
});

requirejs.onError = function( err ) {
	console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};
