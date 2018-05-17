# Web Server in Lambda Function

## Why
For better modularity, we set up another lambda function which serves as a web server, exclusively dealing with all requests from and to the Arduino end.

It has its own storage and persistent variables. The lambda function storing logic for Alexa Skill has all "puzzle-related" variables, whereas this web server lambda function stores all "arduino request-related" variables ( e.g. `toMove`, `startingPos`, `endingPos`, you could also save something like `timesRequested` etc. )

For this web server to be synchronized with the latest puzzle states, we will need to invocation between lambda functions, which will be [discussed later](./4-invoking-another-lambda.md).

## How
1. copy the entire `arduinoRequestHandlers` folders to your project folder.
2. type `./publish.sh` to execute the bash script which compresses all files under `arduinoRequestHandlers/lambda` including node_modules into a .zip file and update to your Amazon Lambda Function.

## Quick Walk-through of the code
- [query parameters](https://en.wikipedia.org/wiki/Query_string) in API query string will appear as a child object in `event` parameter. In our case: `event.action` has a few possible values ( `arduinoPull`, `arduinoMove`, `update` and `availabilityCheck` ), and when any other clients request for the API specified in the [next step: api gateway](./3-configure-api-gateway.md) appending with `?action=arduinoPull` for instance, the web server could find respective handling logic.
- DynamoDB read and write are standard implementation, whose more samples could be seen [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-examples.html).
- Since DynamoDB is also a network asynchronous request (within Amazon's different service), the request our web server received could actually come from DynamoDB which is distinguishable as its `event.Records` will have contents.
- [DynamoDB supported types](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.DataTypes.html)


<a href="./1-build-alexa-skill.md"><img src="./assets/prev_2.png" style="float:left; margin-bottom: 30px;"></img></a>
<a href="./3-configure-api-gateway.md"><img src="./assets/next_2.png" style="float:right;"></img></a>
