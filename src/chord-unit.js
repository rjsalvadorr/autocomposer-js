/**
 * ChordUnit - represents some data built around a specific chord.
 * Has a reference to the next ChordUnit in the progression, and the chord tones that will be used in melody generation.
 */
class ChordUnit {
    /**
    * @param {string} chord - chord symbol
    * @param {string[]} chordTones - array of notes in the melody
    * @param {string[]} nextChordUnit - array of chord symbols
    */
  constructor(chord, chordTones, nextChordUnit) {
    this.chord = chord;
    this.chordTones = chordTones;
    this.nextChordUnit = nextChordUnit;
  }

    /**
    * Recursive function that adds new notes to the previous notes passed into it.
    * @return {string[]} - a list of note progressions. Each element is a string represeting a melody. Each melody string is written as a series of pitches delimited by a space.
    */
  getMelodies() {
    return [];
  }

    /**
    * @param {ChordUnit} next - the next ChordUnit in the chain.
    */
  setNextChordUnit(next) {
    this.nextChordUnit(next);
  }
}

exports.ChordUnit = ChordUnit;
