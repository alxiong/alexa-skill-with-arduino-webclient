module.exports = Object.freeze({
  // App ID: skill app id from developer portal.
  appId: 'amzn1.ask.skill.366897d9-f60f-4e9d-83cb-a731c5855e6f',
  // DynamoDB table name
  dynamoDBTableName: 'PuzzleStateTable',
  originalPuzzle: [
    [8, null, 5],
    [3, 6, 4],
    [2, 7, 1]
  ],
  states: {
    START_MODE: '_START_MODE',
    PLAY_MODE: '_PLAY_MODE'
  },
  arduinoIP: "http://172.20.124.160"
});
