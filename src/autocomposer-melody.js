/**
 * AutoComposerMelody - creates melodies from a given chord progression
 */
class AutoComposerMelody {
  constructor() {
    this.chordProgression = null,
    this.upperLimit = 0,
    this.lowerLimit = 0
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
    * @param {string} upperLimit - note (written in scientific notation)
    * @param {string} lowerLimit - note (written in scientific notation)
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getAllChordTones(chord, upperLimit, lowerLimit) {
    return [];
  }

    /**
    * For a given chord symbol, creates a ChordUnit object
    * @param {string} chord - chord symbol
    * @param {string} upperLimit - note (written in scientific notation)
    * @param {string} lowerLimit - note (written in scientific notation)
    * @return {ChordUnit}
    */
  buildChordUnit(chord, upperLimit, lowerLimit) {
    return [];
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression
    * @param {string[]} chordProgression - chord symbols
    * @return {ChordUnit[]} - a list of ChordUnit objects.
    */
  buildChordList(chordProgression) {
    return [];
  }

    /**
    * For a given chord progression, generate a series of melodies that fit over the progression.
    * @param {string[]} chordProgression - value given by the user
    * @return {string[]} - an array of notes (written in scientific pitch)
    */
  getMelodies(chordProgression) {
    return [];
  }

};

exports.AutoComposerMelody = AutoComposerMelody;
