module.exports = {
  DEFAULT_NOTE_DURATION: "1",
  DEFAULT_NUM_INSTRUMENTS: 3,

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

  DEFAULT_LOWER_LIMIT: "Db4",
  DEFAULT_UPPER_LIMIT: "G#5",

  ACCOMPANIMENT_LOWER_LIMIT: "Gb2",
  ACCOMPANIMENT_UPPER_LIMIT: "C#4",

  BASS_LOWER_LIMIT: "E1",
  BASS_UPPER_LIMIT: "F2",

  NUM_GENERATIONS_LIMIT: 100000, // Number of melody generation attempts that the program will make.
  NUM_MELODIES_LIMIT: 100 // Number of melodies that's returned'
}
