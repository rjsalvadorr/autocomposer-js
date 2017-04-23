var range = require('tonal-range')

/**
 * Encapsulates data and musical logic to be used by the application
 */
class AutoComposerData {
  /**
  * Plain constructor.
  */
  constructor() {
    this.DEFAULT_LOWER_LIMIT = "Bb3",
    this.DEFAULT_UPPER_LIMIT = "B5",

    this.ACCOMPANIMENT_LOWER_LIMIT = "G2",
    this.ACCOMPANIMENT_UPPER_LIMIT = "A3",

    this.BASS_LOWER_LIMIT = "E1",
    this.BASS_UPPER_LIMIT = "F2",

    this.INITIAL_PROGRESSION = "G Em C D",
    this.NUM_MELODIES_LIMIT = 100
  }

  /**
  * Filters out melodies that have a range larger than an octave.
  * @param {string} melodyString - String representing the melody.
  * @return {boolean} - Returns false if the melody has a range larger than one octave. Returns true otherwise.
  */
  filterMelodyRange(melodyString) {
    var totalRange = range.numeric(melodyString);
    var highest = Math.max.apply(null, totalRange);
    var lowest = Math.min.apply(null, totalRange);

    return highest - lowest <= 12;
  }
};

exports.AutoComposerData = AutoComposerData;
