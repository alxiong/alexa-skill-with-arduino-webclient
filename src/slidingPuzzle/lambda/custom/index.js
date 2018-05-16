const Alexa = require('alexa-sdk');
const constants = require('./constants');
const https = require('https');
const stateHandlers = require('./stateHandlers');
const puzzle = require('./puzzle');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = constants.appId;
    alexa.dynamoDBTableName = constants.dynamoDBTableName;
    alexa.registerHandlers(
      newSessionHandlers,
      stateHandlers.startModeIntentHandlers,
      stateHandlers.playModeIntentHandlers
    );
    alexa.execute();
};

const newSessionHandlers = {
  'NewSession': function(){
    // check if it is the first time being invoked
    if (Object.keys(this.attributes).length == 0) {
      this.attributes['moveCount'] = 0;
      this.attributes['solved'] = false;
    }
    this.handler.state = constants.states.START_MODE;
    this.response.speak('Welcome to the final rounds, your mission should you choose to accept it. Would you like to accept the challenge?')
      .listen('Say yes to get briefing about the rules.');
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent' : function() {
    this.response.speak('See you later! You could invoke me again when you want to resume the game.');
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent' : function() {
    this.response.speak('Goodbye!');
    this.emit(':responseReady');
  },
	'SessionEndedRequest' : function() {
    console.log('Session ended with reason: ' + this.event.request.reason);
    this.response.speak('Goodbye!');
    this.emit(':responseReady');
  }
}
