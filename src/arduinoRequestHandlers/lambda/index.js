const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

console.log("loading the arduinoRequestHandlers function");

exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  if (event.Records){
    // response from DynamoDB
    return;
  }

  if (event.action == undefined) {
    callback("400 Unspecified Action");
  }

  var res = {};
  res.action = event.action;
  // Due to asynchronous database read/write operation
  // switch case will ends up premature return/callback.
  if (event.action == "arduinoPull") {
    isMoving(function(err, result){
      if (err || result==true) {
        callback("Still moving, no check shall be allowed!");
      } else {
        getStatus(function(err, result){
          if (err) {
            callback("reading from DB failed.");
          } else {
            res.toMove = result.toMove.BOOL;
            // puting startingPos in array for easy parse for arduino code.
            res.startingPos = JSON.parse(result.startingPos.S)==null? [-1, -1]:[JSON.parse(result.startingPos.S).row, JSON.parse(result.startingPos.S).col];
            res.endingPos = JSON.parse(result.endingPos.S)==null? [-1, -1]:[JSON.parse(result.endingPos.S).row, JSON.parse(result.endingPos.S).col];
            callback(null, res);
          }
        });
      }
    });
  } else if (event.action == "arduinoMove"){
    movingUpdate(function(err, result){
      if(err){
        callback("moving status update failed");
      } else {
        res.moving = true;
        res.toMove = false;
        callback(null, res);
      }
    });
  } else if (event.action == "update"){
    update(event.toMove, event.startingPos, event.endingPos, event.moving, function(err, data){
      if (err) {
        callback(err, res);
      } else {
        res.updateStatus = 'success';
        callback(null, res);
      }
    });
  } else if (event.action == "availabilityCheck"){
    isMoving(function(err, result){
      if (!err) {
        res.isMoving = result;
      }
      callback(null, res);
    });
  } else {
    callback("No Matching Action");
  }

}

// @param: bool toMove; Object startingPos, endingPos; bool moving.
const update = function(toMove, startingPos, endingPos, moving, callback) {
  var params = {
    TableName: 'arduinoProxy',
    Item: {
      'userId': {S: '1'},
      'toMove': {BOOL: toMove==undefined? false: toMove},
      'startingPos': {S: startingPos==undefined? 'null':JSON.stringify(startingPos)},
      'endingPos': {S: endingPos==undefined? 'null':JSON.stringify(endingPos)},
      'moving': {BOOL: moving==undefined? false: moving}
    }
  };
  ddb.putItem(params, function(err, data){
    if (err) {
      console.log("PutItem Error", err);
      callback(err);
    } else {
      console.log("PutItem Success", data);
      callback(null, data);
    }
  });
}

const isMoving = function(callback){
  var params = {
    TableName: 'arduinoProxy',
    Key: {
      'userId': {S: '1'},
    },
    ProjectionExpression: 'moving'
  };
  ddb.getItem(params, function(err, data){
    if (err) {
      console.log("GetItem Error", err);
      callback(err);
    } else {
      console.log("Data from ddb: ", data.Item);
      callback(null, data.Item.moving.BOOL);
    }
  });
}

const getStatus = function(callback){
  var params = {
    TableName: 'arduinoProxy',
    Key: {
      'userId': {S: '1'},
    },
    ProjectionExpression: 'toMove, startingPos, endingPos'
  };
  ddb.getItem(params, function(err, data){
    if (err) {
      console.log("getStatus Error", err);
      callback(err);
    } else {
      console.log("status from ddb: ", data.Item);
      callback(null, data.Item);
    }
  });
}

const movingUpdate = function(callback){
  var params = {
    TableName: 'arduinoProxy',
    Item: {
      'userId': {S: '1'},
      'toMove': {BOOL: false},
      'moving': {BOOL: true}
    }
  };
  ddb.putItem(params, function(err, data){
    if (err) {
      console.log("PutItem Error", err);
      callback(err);
    } else {
      console.log("PutItem Success", data);
      callback(null, data);
    }
  });
}
