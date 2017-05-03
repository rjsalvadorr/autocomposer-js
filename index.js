
var moduleMelody = require('./src/autocomposer-melody');
var moduleMidiWriter = require('./src/autocomposer-midi-writer');
var moduleLogic = require('./src/autocomposer-logic');
var moduleConstants = require('./src/autocomposer-constants');

module.exports = {
  melody: moduleMelody,
  midiWriter: moduleMidiWriter,
  logic: moduleLogic,
  constants: moduleConstants
}
