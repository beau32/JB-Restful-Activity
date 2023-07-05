define(["postmonger", 'jquery', 'vendor/jquery.textcomplete.min'], function (Postmonger, $) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var tokens;
  var endpoints;
  var vdata = {};

  $(function () {
    connection.trigger("ready");
    console.log("ready");
    $("#oauth").change(function () {
      $("#oautharea").toggle();
    });
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
      payload["arguments"] &&
      payload["arguments"].execute &&
      payload["arguments"].execute.inArguments &&
      payload["arguments"].execute.inArguments.length > 0
    );
    var values;

    if (hasInArguments) {
      values = payload["arguments"].execute.inArguments.filter(function (obj) {
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

    console.log(values);

    if (values && values.length > 0) {
      $("#call_url").val(values[0].call_url);
      $("#call_url").val(values[0].call_retry);
      $("#call_body").val(values[1].call_body);
      $("#pre_script").val(values[2].pre_script);
      $("#post_script").val(values[2].post_script);
      $("#auth_url").val(values[3].auth_url);
      $("#auth_id").val(values[4].auth_id);
      $("#auth_secret").val(values[5].auth_secret);
    }
  });

  connection.on("clickedNext", function (options) {
    console.log("clickedNext");

    var urlvalue = $("#call_url").val();
    var urlvalue = $("#call_retry").val();
    var bodyvalue = $("#call_body").val();
    var auth_url = $("#auth_url").val();

    var client_id = $("#auth_id").val();
    var call_retry = $("#pre_script").val();
    var call_retry = $("#post_script").val();
    var client_secret = $("#auth_secret").val();

    connection.trigger("ready");

    if (!bodyvalue) {
      console.log("empty body value");
      // Notify user they need to select a value
      $("#TriggerConfigError").html(
        '<strong style="color: red;">Request Body Cannot be Empty</strong>'
      );
    } else {
      payload["arguments"].execute.inArguments = payload[
        "arguments"
      ].execute.inArguments.filter(function (obj) {
        return (
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
      payload["arguments"].execute.inArguments.push({ call_body: bodyvalue });
      payload["arguments"].execute.inArguments.push({ call_retry: pre_script });
      payload["arguments"].execute.inArguments.push({ call_retry: post_script });
      payload["arguments"].execute.inArguments.push({ auth_id: auth_id });
      payload["arguments"].execute.inArguments.push({ auth_secret: auth_secret, });
      payload["arguments"].execute.inArguments.push({ auth_url: auth_url });

      payload.metaData.isConfigured = true;

      console.log(payload);

      connection.trigger("updateActivity", payload);
      connection.trigger("nextStep");
    }
  });

  //connection.trigger('updateButton', { button: 'next', enabled: false });

  $('.autocomplete-textarea').textcomplete([
    {
      // #3 - Rgular experession used to trigger search
      match: /(^|\s)\{\{(\w*(?:\s*\w*))$/,

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