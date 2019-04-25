# Simple AWS Cognito API
This is an example of a simple API which uses AWS Cognito Userpools for authorization.

## Setup
Deploying the API is very simple, but some post-deployment actions are required to enable CORS.

### Deploying
* Update the `PROJECT` and `BUCKET` variables in the file `deploy.sh`
* Execute `deploy.sh`

### Fixing CORS
* In the AWS Console, go to the API Gateway Service
* Select the Authorized API
* In the Resources tab, select OPTIONS under /data
* Click Method Request
* Set Authorization to NONE and save the changes
* Click "Deploy API" in the Actions drop-down
* Select dev as Deployment stage and click deploy

## Stack outputs
To list the stack outputs, run the following aws cli command:
```
aws cloudformation describe-stacks --stack-name cognito-login-api-dev --query 'Stacks[].Outputs'
```

## Signup
Signing up a user can be done sending a POST request to the `LoginApiGWURL` listed in stack outputs. This can be done with the following curl command:
```
$ curl -X POST $LoginApiGWURL/signup -d {"username": "testuser", "password": "testpass", "email": "testemail@example.com"}
```
The response should look like this:
```
{"UserConfirmed":false,"CodeDeliveryDetails":{"Destination":"t***@e***.com","DeliveryMedium":"EMAIL","AttributeName":"email"},"UserSub":"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
```
A confirmation code has been sent to the specified email.

## Confirm
Confirming a user can be done by sending a POST request to the `LoginApiGWURL` listed in stack outputs. This can be done with the following curl command:
```
$ curl -X POST $LoginApiGWURL/confirm -d {"username": "testuser", "confirmationCode": "123456"}
```
An empty response should be returned:
```
{}
```

## Login
Logging in can be done by sending a POST request to the `LoginApiGWURL` listed in stack outputs. This can be done with the following curl command:
```
$ curl -X POST $LoginApiGWURL/login -d {"username": "testuser", "password": "testpass"}
```
The response should look like following:
```
{"ChallengeParameters":{},"AuthenticationResult":{"AccessToken":"XXXX","ExpiresIn":3600,"TokenType":"Bearer","RefreshToken":"YYYY","IdToken":"ZZZZ"}}
```
The IdToken should be used when accessing the `AuthorizedApiGWURL`.

## Requesting data
To request the sample data from `AuthorizedApiGWURL` listed in stack outputs, a GET request can be sent. This can be done with the following curl command:
```
$ curl -X GET $AuthorizedApiGWURL/data -H "Authorization: ZZZZ"
```
The response should look like following:
```
[{"name":"John Doe","age":42},{"name":"Susan Tyler","age":36}]
```
