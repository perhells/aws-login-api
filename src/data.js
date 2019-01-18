'use strict';

exports.handler = (event, context, callback) => {
    var response = {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify([
            {
                "name": "John Doe",
                "age": 42
            },
            {
                "name": "Susan Tyler",
                "age": 36
            }
        ])
    };
    callback(null, response);
};
