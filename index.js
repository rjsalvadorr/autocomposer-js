
var moduleMelody = require('./src/melody');
var moduleMidiWriter = require('./src/midi-writer');
var moduleLogic = require('./src/logic');
var moduleConstants = require('./src/constants');

module.exports = {
  melody: moduleMelody,
  midiWriter: moduleMidiWriter,
  // the player is not included!
  logic: moduleLogic,
  constants: moduleConstants
}
