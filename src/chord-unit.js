var AcLogic = require('../src/autocomposer-logic');
var AutoComposerLogic = new AcLogic.AutoComposerLogic();

/**
* Represents some data built around a specific chord.
* Has a reference to the next ChordUnit in the progression, and the chord tones that will be used in melody generation.
* @private
*/
class ChordUnit {
    /**
    * @param {string} chord - chord symbol
    * @param {string[]} chordTones - array of notes in the melody
    * @param {ChordUnit} nextChordUnit - next ChordUnit in the chain
    */
  constructor(chord, chordTones, nextChordUnit) {
    /** @type {string} */
    this.chord = chord;
    /** @type {string[]} */
    this.chordTones = chordTones;
    /** @type {ChordUnit} */
    this.nextChordUnit = nextChordUnit;
  }

    /**
    * @param {ChordUnit} next - the next ChordUnit in the chain.
    */
  setNextChordUnit(next) {
    this.nextChordUnit(next);
  }
}

exports.ChordUnit = ChordUnit;
