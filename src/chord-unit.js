var AcData = require('../src/autocomposer-data');
var AutoComposerData = new AcData.AutoComposerData();

/**
 * Represents some data built around a specific chord.
 * Has a reference to the next ChordUnit in the progression, and the chord tones that will be used in melody generation.
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
    * Recursive function that adds new notes to the previous notes passed into it.
    * @param {string[]} melodyList - list of existing melodies
    * @param {boolean} enableFiltering - if true, generated melodies will be filtered.
    * @return {string[]} - a list of melodies. Each element is a string represeting a melody. Each melody string is written as a series of pitches delimited by a space.
    */
  getMelodies(melodyList, enableFiltering) {
    var returnList = [];
    var chordTones = this.chordTones;
    var newMelody;

    if(melodyList) {
      // We're somewhere along the middle of the chain.
      melodyList.forEach(function(currentMelody) {
        chordTones.forEach(function(currentChordTone) {
          newMelody = currentMelody + " " + currentChordTone;
          if(enableFiltering) {
            if(AutoComposerData.filterMelodyRange(newMelody)) {
              returnList.push(newMelody);
            }
          } else {
            returnList.push(newMelody);
          }
        });
      });
    } else {
      // This is the beginning of the chain.
      melodyList = this.chordTones;
      returnList.push.apply(returnList, melodyList);
    }

    if(this.nextChordUnit) {
      // We're somewhere along the middle of the chain.
      return this.nextChordUnit.getMelodies(returnList, enableFiltering);
    } else {
      // End of the chain.
      return returnList;
    }
  }

    /**
    * @param {ChordUnit} next - the next ChordUnit in the chain.
    */
  setNextChordUnit(next) {
    this.nextChordUnit(next);
  }
}

exports.ChordUnit = ChordUnit;
