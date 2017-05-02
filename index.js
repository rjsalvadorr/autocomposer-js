
var moduleMelody = require('./src/autocomposer-melody');
var moduleMidi = require('./src/autocomposer-midi');
var moduleLogic = require('./src/autocomposer-logic');

class AutoComposer {
  constructor() {
    this.melody = moduleMelody // Melody module
    this.midi = moduleMidi // MIDI module
    this.logic = moduleLogic // Logic module
  }
}

module.exports = new AutoComposer();
