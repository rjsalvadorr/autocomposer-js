
var moduleMelody = require('./src/autocomposer-melody');
var moduleMidi = require('./src/autocomposer-midi-writer');
var moduleLogic = require('./src/autocomposer-logic');

module.exports = {
  melody: moduleMelody,
  midiWriter: moduleMidi,
  logic: moduleLogic
}
