var tonal = require('tonal');
var ChordUnit = require('./chord-unit');

var AutoComposerData = require('./autocomposer-data');
var AcData = new AutoComposerData.AutoComposerData();

/**
 * Creates melodies from a given chord progression
 */
class AutoComposerMelody {
  /**
  * @param {string[]} chordProgression - array of chord symbols
  * @param {string} lowerLimit - lower boundary note (in scientific notation)
  * @param {string} upperLimit - upper boundary note (in scientific notation)
  */
  constructor(chordProgression, lowerLimit, upperLimit) {
    /** @type {string[]} */
    this.chordProgression = chordProgression || AcData.INITIAL_PROGRESSION,
    /** @type {string} */
    this.lowerLimit = lowerLimit || AcData.DEFAULT_LOWER_LIMIT,
    /** @type {string} */
    this.upperLimit = upperLimit || AcData.DEFAULT_UPPER_LIMIT
  }

    /**
    * For a given note, find its lowest instance in the specified range.
    * @param {string} note - note (written in scientific notation)
    * @param {string} upperLimit - note (written in scientific notation)
    * @param {string} lowerLimit - note (written in scientific notation)
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getLowestNoteInRange(note, upperLimit, lowerLimit) {
    return [];
  }

    /**
    * For a given chord, get all the chord tones between the upper and lower limits.
    * @param {string} chord - chord symbol
    * @param {string} lowerLimit - note (written in scientific notation)
    * @param {string} upperLimit - note (written in scientific notation)
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getAllChordTones(chord, lowerLimit, upperLimit) {
    var chordTones = tonal.chord(chord);
    var chordTonesInRange = tonal.range.pitchSet(chordTones, [lowerLimit, upperLimit]);

    for(var i = 0; i < chordTonesInRange.length; i++) {
      for(var j = 0; j < chordTones.length; j++) {
        // Fixing pesky issue where D7 was returned as "D Gb A C" instead of "D F# A C"
        // If the current chord tone is enharmonic with the note from the pitch set,
        // Override it with the chord tone.
        if(tonal.note.pc(chordTonesInRange[i]) != chordTones[j]
          && tonal.note.enharmonics(chordTones[j]).indexOf(tonal.note.pc(chordTonesInRange[i])) > -1) {
          chordTonesInRange[i] = chordTones[j] + tonal.note.oct(chordTonesInRange[i]);
        }
      }
    }

    return chordTonesInRange;
  }

    /**
    * For a given chord symbol, creates a ChordUnit object
    * @param {string} chord - chord symbol
    * @param {string} lowerLimit - note (in scientific notation)
    * @param {string} upperLimit - note (in scientific notation)
    * @return {ChordUnit}
    */
  buildChordUnit(chord, lowerLimit, upperLimit) {
    var chordTonesInRange = this.getAllChordTones(chord, lowerLimit, upperLimit);
    var chordUnit = new ChordUnit.ChordUnit(chord, chordTonesInRange, null);
    return chordUnit;
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression
    * @param {string[]} chordProgression - chord symbols
    * @param {string} lowerLimit - lower limit (in scientific notation). Optional value.
    * @param {string} upperLimit - upper limit (in scientific notation). Optional value.
    * @return {ChordUnit[]} - a list of ChordUnit objects.
    */
  buildChordUnitList(chordProgression, lowerLimit, upperLimit) {
    if(lowerLimit == null) {
      lowerLimit = this.lowerLimit;
    }
    if(upperLimit == null) {
      upperLimit = this.upperLimit;
    }

    var chordUnitList = [];
    var chordTonesInRange;

    for(var i = chordProgression.length - 1; i >= 0; i--) {
      chordTonesInRange = this.getAllChordTones(chordProgression[i], lowerLimit, upperLimit);

      if(i === chordProgression.length) {
        chordUnitList[i] = new ChordUnit.ChordUnit(chordProgression[i], chordTonesInRange, null);
      } else {
        chordUnitList[i] = new ChordUnit.ChordUnit(chordProgression[i], chordTonesInRange, chordUnitList[i + 1]);
      }
    }

    return chordUnitList;
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression.
    * @param {string[]} chordProgression - chord progression given by user
    * @param {boolean} enableFiltering - if true, generated melodies will be filtered.
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getMelodies(chordProgression, enableFiltering) {
    var chordUnitList = this.buildChordUnitList(chordProgression, this.lowerLimit, this.upperLimit);
    var melodies = chordUnitList[0].getMelodies(null, enableFiltering);
    return melodies;
  }

};

exports.AutoComposerMelody = AutoComposerMelody;
