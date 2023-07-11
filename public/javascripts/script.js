'use strict';
/**
 * Handle clicks in the UI
 */

// Make sure jQuery is loaded first
$(function() {

    var $fireSubmit    = $('#fire');
    var $reset          = $('#reset');
    var $clear          = $('#clear');
    var $fetch          = $('#fetch');
    var $results        = $('.results');
    var $events        = $('.events');
    var $form = $('form');

    //rehydrate the form vars
    var cvariables = $.cookie("form");
    
    if (cvariables){
        var str = decodeURIComponent(cvariables).replace(/\+/g,' ').split('&');
        str.forEach((e)=>{
            var a = e.split('=');
            $('#'+a[0]).val(a[1]);
        })
    }
    
    $form.submit((evt)=>{
        evt.preventDefault();
    });
    
    // When someone submits this form, fire the event to the custom trigger
    $fireSubmit.on('click', function( evt ) {
        console.log('fire')
        var c = $form.serialize();
        $.cookie("form", c);

        var reqBody     = {
            sfdomain:  $('#sfmcdomain').val(),
            clientid:  $('#clientid').val(),
            clientsecret: $('#clientsecret').val(),
            eventbody: $('#eventbody').val(),
        };
        
        // Disable the inputs until we receive a resposne
        
        $fireSubmit.attr( 'disabled', 'disabled' );

        $.ajax( '/fireEvent', {
            type: 'POST',
            data: reqBody}).
            error(( xhr, status, error ) => {
                console.log( 'ERROR: ', error );
                $events.append( '<li>Error: ' +  error + '</li>' );
            }).
            done(( data, status, xhr ) => {
                console.log( 'Response from Journey Builder: ', data );
                $events.append( '<li>EventInstanceId: ' + String(data.eventid) + '</li>' );
            }).
            complete(() => {
                // Enable the inputs until we receive a resposne
                $('#clientid').removeAttr( 'disabled' );
                $('#clientsecret').removeAttr( 'disabled' );
                $fireSubmit.removeAttr( 'disabled' );
            });
    });

    $clear.on('click', function( evt ) {
        $.ajax( '/clearList', {
            error: function( xhr, status, error ) {
                console.log( 'ERROR: ', error );
            },
            success: function( data, status, xhr ) {
                $results.html( '' );
            }
        });
    });

    $reset.on('click', function( evt ) {
        $events.html('');
        $.cookie('form','');
        location.reload();
    });

    $fetch.on('click', function( evt ) {
        $.ajax( '/getActivityData', {
            type: 'GET',
            dataType: 'json',
            error: function( xhr, status, error ) {
                console.log( 'ERROR: ', error );
            },
            success: function( data, status, xhr ) {
                if( !data.data && !data.data.length ) {
                    $results.append( '<li>There are no logs in the list</li>' );
                } else {
                    var dataLength = data.data.length;
                    while( dataLength-- ) {
                        $results.append( '<li><code><pre>'+ JSON.stringify( data.data[dataLength], null, 4 ) +'</pre></code></li>' );
                    }
                }
            }
        });
    });
});
