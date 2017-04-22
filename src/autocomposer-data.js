/**
 * AutoComposerData - contains data to be used by the application
 */
class AutoComposerData {
  constructor() {
    this.DEFAULT_LOWER_LIMIT = "B3",
    this.DEFAULT_UPPER_LIMIT = "B5",

    this.ACCOMPANIMENT_LOWER_LIMIT = "G2",
    this.ACCOMPANIMENT_UPPER_LIMIT = "A3",

    this.BASS_LOWER_LIMIT = "E1",
    this.BASS_UPPER_LIMIT = "F2",

    this.INITIAL_PROGRESSION = "G Em C D"
  }
};

exports.AutoComposerData = AutoComposerData;
