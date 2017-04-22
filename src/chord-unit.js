/**
 * ChordUnit - represents some data built around a specific chord.
 * Has a reference to the next chord in the progression, and the chord tones that will be used in melody generation.
 */
class ChordUnit {
  constructor(nextChord, chordTones) {
    this.nextChord = nextChord;
    this.chordTones = chordTones;
  }

    /**
    * Recursive function that adds new notes to the previous notes passed into it.
    * @return {string[]} - a list of note progressions. Each element is a string represeting a melody. Each melody string is written as a series of pitches delimited by a space.
    */
  getMelodies() {
    return [];
  }
}

exports.ChordUnit = ChordUnit;
