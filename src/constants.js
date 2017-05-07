/**
* Constants used by the application.
* @public
* @type {Object}
* @property {string} DEFAULT_NOTE_DURATION - Note duration for simple melodies
* @property {number} DEFAULT_NUM_INSTRUMENTS - Default number of instruments
* @property {string} DEFAULT_LOWER_LIMIT - Lower limit of main melody's range (pitch in scientific notation)
* @property {string} DEFAULT_UPPER_LIMIT - Upper limit of main melody's range (pitch in scientific notation)
* @property {string} ACCOMPANIMENT_LOWER_LIMIT - Lower limit of accompaniment range (pitch in scientific notation)
* @property {string} ACCOMPANIMENT_UPPER_LIMIT - Upper limit of accompaniment range (pitch in scientific notation)
* @property {string} BASS_LOWER_LIMIT - Lower limit of bassline's range (pitch in scientific notation)
* @property {string} BASS_UPPER_LIMIT - Upper limit of bassline's range (pitch in scientific notation)
* @property {number} NUM_GENERATIONS_LIMIT - Limit on number of melody generation attempts (unused)
* @property {number} NUM_MELODIES_LIMIT - Limit on number of returned melodies
* @property {Object} instrumentData - Data for the default instruments used by the app.
*/
var AcConstants = {
  DEFAULT_NOTE_DURATION: "1",
  DEFAULT_NUM_INSTRUMENTS: 3,

  DEFAULT_LOWER_LIMIT: "Db4",
  DEFAULT_UPPER_LIMIT: "G#5",

  ACCOMPANIMENT_LOWER_LIMIT: "Gb2",
  ACCOMPANIMENT_UPPER_LIMIT: "C#4",

  BASS_LOWER_LIMIT: "E1",
  BASS_UPPER_LIMIT: "F2",

  instrumentData: {
    melody: {
      role: "melody",
      name: "violin",
      gain: 1.7,
      midiInstrumentCode: 40
    },
    accompaniment: {
      role: "accompaniment",
      name: "acoustic_guitar_steel",
      gain: 1.6,
      midiInstrumentCode: 25
    },
    bass: {
      role: "bass",
      name: "acoustic_bass",
      gain: 1.65,
      midiInstrumentCode: 32
    },
    getByName: function(instrName) {
      for (var instrumentRole in this) {
        if(instrName === this[instrumentRole].name) {
          return this[instrumentRole];
        }
      }
      return null;
    }
  },

  NUM_GENERATIONS_LIMIT: 100000, // Number of melody generation attempts that the program will make.
  NUM_MELODIES_LIMIT: 100, // Number of melodies that's returned',
  DURATION_FACTOR: 48 // All note durations are expressed as a fraction of 24. Like 6/48 for a 32nd note and 4/48 for a 32nd note triplet.
}

AcConstants.instrumentData["melody"].lowerLimit = AcConstants.DEFAULT_LOWER_LIMIT;
AcConstants.instrumentData["melody"].upperLimit = AcConstants.DEFAULT_UPPER_LIMIT;

AcConstants.instrumentData["accompaniment"].lowerLimit = AcConstants.ACCOMPANIMENT_LOWER_LIMIT;
AcConstants.instrumentData["accompaniment"].upperLimit = AcConstants.ACCOMPANIMENT_UPPER_LIMIT;

AcConstants.instrumentData["bass"].lowerLimit = AcConstants.BASS_LOWER_LIMIT;
AcConstants.instrumentData["bass"].upperLimit = AcConstants.BASS_UPPER_LIMIT;

AcConstants.DUR_WHOLE = AcConstants.DURATION_FACTOR * 4;

AcConstants.DUR_HALF = AcConstants.DUR_WHOLE / 2;
AcConstants.DUR_HALF_DOT = AcConstants.DUR_HALF * 1.5;
AcConstants.DUR_HALF_TRP = AcConstants.DUR_WHOLE / 3;

AcConstants.DUR_QUARTER = AcConstants.DUR_HALF / 2;
AcConstants.DUR_QUARTER_DOT = AcConstants.DUR_QUARTER * 1.5;
AcConstants.DUR_QUARTER_TRP = AcConstants.DUR_HALF / 3;

AcConstants.DUR_8TH = AcConstants.DUR_QUARTER / 2;
AcConstants.DUR_8TH_DOT = AcConstants.DUR_8TH * 1.5;
AcConstants.DUR_8TH_TRP = AcConstants.DUR_QUARTER / 3;

AcConstants.DUR_16TH = AcConstants.DUR_8TH / 2;
AcConstants.DUR_16TH_DOT = AcConstants.DUR_16TH * 1.5;
AcConstants.DUR_16TH_TRP = AcConstants.DUR_8TH / 3;

AcConstants.DUR_32ND = AcConstants.DUR_16TH / 2;
AcConstants.DUR_32ND_DOT = AcConstants.DUR_32ND * 1.5;
AcConstants.DUR_32ND_TRP = AcConstants.DUR_16TH / 3;

module.exports = AcConstants;
