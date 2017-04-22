/**
 * MelodyUnit - represents some data built around a melody.
 * Has a reference to the chord progression, and the notes in the melody.
 */
class MelodyUnit {
  constructor() {
    this.chordProgression = [];
    this.melodyNotes = [];
    this.smoothness = null;
  }
}

exports.MelodyUnit = MelodyUnit;
