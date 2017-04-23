/**
 * Represents some data built around a melody.
 * Has a reference to the chord progression, and the notes in the melody.
 */
class MelodyUnit {
    /**
    * @param {string[]} chordProgression - array of chord symbols
    * @param {string[]} melodyNotes - array of notes in the melody
    */
  constructor(chordProgression, melodyNotes) {
  	/** @type {string[]} */
    this.chordProgression = [];
    /** @type {string[]} */
    this.melodyNotes = [];
    /** @type {number} */
    this.smoothness = null;
    /** @type {number} */
    this.range = null;
    /** @type {string} */
    this.contour = "";
  }
}

exports.MelodyUnit = MelodyUnit;
