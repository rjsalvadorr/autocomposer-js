var range = require('tonal-range')

/**
 * Represents a melody and associated metadata.
 */
class MelodyUnit {
    /**
    * @param {string[]} chordProgression - array of chord symbols
    * @param {string[]} melodyNotes - array of notes in the melody
    */
  constructor(chordProgression, melodyNotes) {
  	/** @type {string[]} */
    this.chordProgression = chordProgression;
    /** @type {string[]} */
    this.melodyNotes = melodyNotes;
    /** @type {number} */
    this.smoothness = this.getSmoothness();
    /** @type {number} */
    this.range = this.getRange();
    /** @type {string} */
    this.contour = "";
  }

    /**
    * Calculates the range of this melody.
    * @private
    * @return {number} - Range of the melody (in semitones)
    */
  getRange() {
    var totalRange = range.numeric(this.melodyNotes);
    var highest = Math.max.apply(null, totalRange);
    var lowest = Math.min.apply(null, totalRange);

    return highest - lowest;
  }

    /**
    * Calculates the smoothness of this melody.
    * @private
    * @return {number} - Range of the melody (in semitones)
    */
  getSmoothness() {
    var totalSmoothness = 0;
    var subset, subRange, highest, lowest, distance;

    for(var i = 2; i <= this.melodyNotes.length; i++) {
      subset = this.melodyNotes.slice(i - 2, i);
      subRange = range.numeric(subset);
      highest = Math.max.apply(null, subRange);
      lowest = Math.min.apply(null, subRange);
      distance = highest - lowest;
      totalSmoothness += distance;
    }

    return totalSmoothness;
  }

}

exports.MelodyUnit = MelodyUnit;
