requirejs.config({
    paths: {
        vendor: '../vendor',
		postmonger: 'JBcustom/vendor/postmonger'
    },
    shim: {
        'vendor/jquery.min': {
            exports: '$'
        },
		'JBcustom': {
			deps: ['JBcustom/vendor/jquery.min', 'JBcustom/vendor/postmonger']
		}
    }
});

requirejs( ['vendor/jquery.min', 'JBcustom'], function( $, ContactSpace ) {
	//console.log( 'REQUIRE LOADED' );
});

requirejs.onError = function( err ) {
	//console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};
