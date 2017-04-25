var range = require('tonal-range');
var chord = require('tonal-chord');

/**
 * Encapsulates data and musical logic to be used by the application
 */
class AutoComposerData {
  /**
  * Plain constructor.
  */
  constructor() {
    this.DEFAULT_LOWER_LIMIT = "Db4";
    this.DEFAULT_UPPER_LIMIT = "G#5";

    this.ACCOMPANIMENT_LOWER_LIMIT = "Gb2";
    this.ACCOMPANIMENT_UPPER_LIMIT = "C#4";

    this.BASS_LOWER_LIMIT = "E1";
    this.BASS_UPPER_LIMIT = "F2";

    this.INITIAL_PROGRESSION = "enter chords like \"G Em C\"";
    this.NUM_MELODIES_LIMIT = 100; // Number of melodies that the user sees.
    this.NUM_GENERATIONS_LIMIT = 100000; // Number of melody generation attempts that the program will make.
    this.CHORDS_LIMIT = 4;
  }

  /**
  * Returns all the chord types available for use.
  * @return {string[]} - chord types available for use
  */
  getChordDictionary() {
    return chord.names();
  }

  /**
  * Filters out melodies that have a range larger than an octave.
  * @param {string} melodyString - String representing the melody
  * @return {boolean} - Returns false if the melody has a range larger than one octave. Returns true otherwise
  */
  filterMelodyRange(melodyString) {
    var totalRange = range.numeric(melodyString);
    var highest = Math.max.apply(null, totalRange);
    var lowest = Math.min.apply(null, totalRange);

    return highest - lowest <= 12;
  }
};

exports.AutoComposerData = AutoComposerData;
