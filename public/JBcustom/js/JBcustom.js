define(["postmonger", 'jquery','vendor/jquery.textcomplete.min'], function (Postmonger, $) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var tokens;
  var endpoints;
  var vdata = {};

  //page load
  $(function () {
    connection.trigger("ready");

    $("#oauth").change(function () {
      $("#oautharea").toggle();
    });
    
    $('.autocomplete-textarea').textcomplete([
      {
        // #3 - Rgular experession used to trigger search
        match: /(^|\s|\"|\')\{\{(\w*(?:\s*\w*))$/,
  
        // #4 - Function called at every new keystroke
        search: function (word, callback) {
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
          ];
  
          callback($.map(l, function (word) {
            return word.indexOf(word) === 0 ? word : null;
          }));
        },
  
        // #6 - Template used to display the selected result in the textarea
        replace: function (hit) {
          return '{{' + hit + '}}';
        }
      }])
      
  });

  // Journey Builder broadcasts this event to us after this module
  // sends the "ready" method. JB parses the serialized object which
  // consists of the Event Data and passes it to the
  // "config.js.save.uri" as a POST
  connection.on("initActivity", function (data) {
    console.log("initActivity");
    console.log(data);

    if (data) {
      payload = data;
    }

    var hasInArguments = Boolean(
      payload.arguments &&
      payload.arguments.execute &&
      payload.arguments.execute.inArguments &&
      payload.arguments.execute.inArguments.length > 0
    );

    var values;

    if (hasInArguments) {
      values = payload.arguments.execute.inArguments.filter(function (obj) {
        return (
          obj.hasOwnProperty("call_url") ||
          obj.hasOwnProperty("call_retry") ||
          obj.hasOwnProperty("call_body") ||
          obj.hasOwnProperty("pre_script") ||
          obj.hasOwnProperty("post_script") ||
          obj.hasOwnProperty("auth_url") ||
          obj.hasOwnProperty("auth_id") ||
          obj.hasOwnProperty("auth_secret")
        );
      });
    }
    console.log("output saved vars");
    console.log(values);

    //populate the form with values if previous saved
    for (const property in values) {
      var k = Object.keys(values[property])
      $("#"+k).val(values[property][k]);
    }
  });

  connection.on("clickedNext", function (options) {
    console.log("clickedNext");

    var call_url = $("#call_url").val();
    var call_retry = $("#call_retry").val();
    var call_body = $("#call_body").val();
    var auth_url = $("#auth_url").val();
    
    var pre_script = $("#pre_script").val();
    var post_script = $("#post_script").val();
    var auth_id = $("#auth_id").val();
    var auth_secret = $("#auth_secret").val();

    if (!call_body) {
      console.log("empty body value");
      // Notify user they need to select a value
      $("#TriggerConfigError").html(
        '<strong style="color: red;">Request Body Cannot be Empty</strong>'
      );
    } else {
      $("#TriggerConfigError").hide();

      payload.arguments.execute.inArguments = payload.arguments.execute.inArguments.filter(function (obj) {
        return (
          obj.hasOwnProperty("call_url") ||
          obj.hasOwnProperty("call_body") ||
          obj.hasOwnProperty("call_retry") ||
          obj.hasOwnProperty("pre_script") ||
          obj.hasOwnProperty("post_script") ||
          obj.hasOwnProperty("auth_url") ||
          obj.hasOwnProperty("auth_id") ||
          obj.hasOwnProperty("auth_secret")
        );
      });

      if (!payload.name) payload.name = "JBCustom";
      payload.arguments.execute.inArguments = [];
      payload.arguments.execute.inArguments.push({ 'call_url': call_url });
      payload.arguments.execute.inArguments.push({ 'call_body': call_body });
      payload.arguments.execute.inArguments.push({ 'call_retry': call_retry });
      payload.arguments.execute.inArguments.push({ 'post_script': post_script });
      payload.arguments.execute.inArguments.push({ 'pre_script': pre_script });
      payload.arguments.execute.inArguments.push({ 'auth_id': auth_id });
      payload.arguments.execute.inArguments.push({ 'auth_secret': auth_secret, });
      payload.arguments.execute.inArguments.push({ 'auth_url': auth_url });
      payload.arguments.validate.inArguments = payload.arguments.execute.inArguments
      payload.arguments.publish.inArguments = payload.arguments.execute.inArguments
      payload.arguments.save.inArguments = payload.arguments.execute.inArguments

      payload.metaData.isConfigured = true;
      console.log("output form vars");
      console.log(payload);

      connection.trigger("updateActivity", payload);
      connection.trigger("nextStep");
    }
  });

  //connection.trigger('updateButton', { button: 'next', enabled: false });

});