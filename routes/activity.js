"use strict";
var util = require("util");
var vm = require("vm");
var fs = require("fs");
var axios = require("axios");
const oauth = require("axios-oauth-client");
const tokenProvider = require("axios-token-interceptor");
const axiosRetry = require("axios-retry");
const async = require("async");

require("axios-debug-log");

var Validator = require("jsonschema").Validator;

Validator.prototype.customFormats.getorpost = function (input) {
  return input === "get" || input === "post";
};

Validator.prototype.customFormats.retry = function (input) {
  return input.search(/^\d{1}$/) != -1;
};

Validator.prototype.customFormats.url = function (input) {
  return (
    input.length == 0 ||
    input.search(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i
    ) != -1
  );
};

exports.logExecuteData = [];

function logData(req) {
  exports.logExecuteData.push({
    body: req.body,
    headers: req.headers,
    trailers: req.trailers,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    route: req.route,
    cookies: req.cookies,
    ip: req.ip,
    path: req.path,
    host: req.host,
    fresh: req.fresh,
    stale: req.stale,
    protocol: req.protocol,
    secure: req.secure,
    originalUrl: req.originalUrl,
  });

  console.log("Log Saved");
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );

  logData(req);
  res.status(200).send("edit");
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );

  logData(req);
  res.status(200).send("Save");
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  console.log(req.body);
  console.log("------");

  var inArguments = req.body.inArguments;
  var json = {};

  var msg;

  try {
    var val = Object.values(inArguments);
    for (var key of val) {
      if (key.hasOwnProperty("call_body")) {
        json.call_body = JSON.parse(key.call_body);
      }
      if (key.hasOwnProperty("call_retry")) {
        json.call_retry = key.call_retry;
      }
      if (key.hasOwnProperty("auth_id")) {
        json.auth_id = key.auth_id;
      }
      if (key.hasOwnProperty("auth_url")) {
        json.auth_url = key.auth_url;
      }
      if (key.hasOwnProperty("auth_secret")) {
        json.auth_secret = key.auth_secret;
      }
      if (key.hasOwnProperty("call_url")) {
        json.call_url = key.call_url;
      }
      if (key.hasOwnProperty("pre_script")) {
        json.pre_script = key.pre_script;
      }
      if (key.hasOwnProperty("post_script")) {
        json.post_script = key.post_script;
      }
    }

    require("axios-debug-log/enable");

    let instance = axios.create();

    if (json.call_retry) {
      axiosRetry(instance, { retries: json.call_retry });
    }

    if (json.auth_url) {
      const getAuthorizationCode = oauth.client(axios.create(), {
        url: json.auth_url,
        grant_type: "client_credentials",
        client_id: json.auth_id,
        client_secret: json.auth_secret,
      });
      const cache = tokenProvider.tokenCache(
        () => getAuthorizationCode().then((res) => res),
        {
          getMaxAge: (body) => body.expires_in * 1000,
        }
      );

      instance.interceptors.request.use(
        tokenProvider({
          getToken: cache,
          headerFormatter: (body) => "Bearer " + body.access_token,
        })
      );
    }

    console.log(json);
    console.log("------");

    //pre script runs first, then execute axio callbody, then webhook, then post script
    async.series(
      [
        (callback) => {
          if (json.pre_script) {
            console.log('running pre_script');

            const context = { inArguments: inArguments };
            vm.createContext(context); // Contextify the object.
            vm.runInContext(json.pre_script, context);
            inArguments = context.inArguments
          }
        },
        (callback) => {
          console.log('running axio callbody');
          instance(json.call_body)
            .then((ares) => {
              msg = "OK";
              res.status(200).send(msg);
              return ares;
            })
            .catch((err) => {
              console.error(err);
              msg = err.code;
              res.status(200).send(msg);
            })
            .finally((res) => {
              console.log('running webhook');
              if (json.call_url)
                instance({
                  method: "post",
                  url: json.call_url,
                }).then((webhookres) => {
                  console.log('running post_script');

                  if (json.post_script) {
                    const context = { inArguments: inArguments, response: res, webhook_response: webhookres.data };
                    vm.createContext(context); // Contextify the object.
                    vm.runInContext(json.post_script, context);
                  }

                });
            });
        },
      ],
      (err, results) => {
        if (err) console.error(err);
        console.log(results);
      });
  } catch (e) {
    console.error(e);
    msg = e.message;
    res.status(200).send(msg);
  }
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  logData(req);
  res.status(200).send("Publish");
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
  // Data from the req and put it in an array accessible to the main app, validated to ensure it has the right element to execute the call.
  var validator = new Validator();

  if (req.body.inArguments.length < 1) {
    res.status(200).send("Invalid InArguments");
    return;
  }

  var callbody_schema = {
    id: "/axios",
    type: "object",
    properties: {
      method: { type: "string", format: "getorpost" },
      url: { type: "string", format: "url" },
      data: { type: "object" },
    },
    required: ["method", "url"],
  };

  var schema = {
    id: "/postvar",
    type: "object",
    properties: {
      call_body: { $ref: "/axios" },
      call_retry: { type: "string", format: "retry", minLength: 0 },
      auth_url: { type: "string", format: "url", minLength: 0 },
      auth_id: { type: "string", minLength: 0 },
      auth_secret: { type: "string", minLength: 0 },
      call_url: { type: "string", format: "url", minLength: 0  },
    },
    required: ["call_body"],
    dependencies: {
      auth_url: ["auth_id", "auth_secret"],
    },
  };
  validator.addSchema(callbody_schema, "/axios");

  try {
    
    var val = Object.values(req.body.inArguments);
    var json = {};
    console.log('inarguments val:');
    console.log(val);

    for (var key of val) {
      if (key.hasOwnProperty("call_body")) {
        console.log('call body:');
        console.log(key.call_body);
        json.call_body = JSON.parse(key.call_body);
      }
      if (key.hasOwnProperty("call_retry")) {
        json.call_retry = key.call_retry;
      }
      if (key.hasOwnProperty("auth_id")) {
        json.auth_id = key.auth_id;
      }
      if (key.hasOwnProperty("auth_url")) {
        json.auth_url = key.auth_url;
      }
      if (key.hasOwnProperty("auth_secret")) {
        json.auth_secret = key.auth_secret;
      }
      if (key.hasOwnProperty("call_url")) {
        json.call_url = key.call_url;
      }
    }

    var result = validator.validate(json, schema);
    var msg = "";

    if (result.errors.length != 0) {
      msg = result.errors.map(function (err) {
        return err.stack;
      });
    } else {
      msg = "OK";
    }
    logData(req);

    console.log(msg);
  } catch (e) {
    console.log(e);
    msg = e.message;
  }

  res.status(200).send(msg);
};
