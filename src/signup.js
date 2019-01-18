'use strict';

var AWS = require('aws-sdk');

var userPoolId = process.env.UserPoolId;
var clientId = process.env.ClientId;
var region = process.env.Region;

var options = {
    region: region
};

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(options = options);

exports.handler = (event, context, callback) => {
    if (event.body === null || event.body === undefined) {
        var response = {
            "statusCode": 400,
            "headers": {
                'Access-Control-Allow-Origin' : '*',
                'Content-Type': 'application/json'
            },
            "body": "Malformed request (Expected username, password, and email in POST body)"
        };
        callback(null, response);
    }
    var body = JSON.parse(event.body);
    var username = body.username;
    var password = body.password;
    var email = body.email;

    var params = {
        ClientId: clientId,
        Password: password,
        Username: username,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            }
        ],
        ValidationData: [
            {
                Name: 'email',
                Value: email
            }
        ]
    };

    cognitoidentityserviceprovider.signUp(params, function(err, data) {
        if (err) {
            var response = {
                "statusCode": 400,
                "headers": {
                    'Access-Control-Allow-Origin' : '*',
                    'Content-Type': 'application/json'
                },
                "body": JSON.stringify(err)
            };
            callback(null, response);
        } else {
            var response = {
                "statusCode": 200,
                "headers": {
                    'Access-Control-Allow-Origin' : '*',
                    'Content-Type': 'application/json'
                },
                "body": JSON.stringify(data)
            };
            callback(null, response);
        }
    });
};
