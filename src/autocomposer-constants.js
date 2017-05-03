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
  }
}
