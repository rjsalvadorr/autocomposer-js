/**
 * AutoComposerMelody - creates melodies from a given chord progression
 */
class AutoComposerMelody {
  constructor() {
    this.chordProgression = null,
    this.upperLimit = 0;
    this.lowerLimit = 0;
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
