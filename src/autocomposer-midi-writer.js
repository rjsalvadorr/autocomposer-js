var MidiWriter = require('midi-writer-js');
var MidiPlayer = require('midi-player-js');
var SoundfontPlayer = require('soundfont-player');
var tonalNote = require('tonal-note');

const AcConstants = require('./autocomposer-constants');
const INSTRUMENT_DATA = AcConstants.instrumentData;

/**
* Class responsible for generating MIDI files for future playback.
*/

class AutoComposerMidiWriter {
  constructor() {
  }

    /**
    * Builds MIDI info for a note or chord
    * @private
    * @param {number[]} arrNumMidi - MIDI numbers for a set of pitches
    * @param {number} duration - MIDI number for a pitch
    * @param {number} wait
    * @return {MidiWriter.NoteEvent} - ???
    */
  _buildMidi(arrNumMidi, duration, wait) {
      if(!wait) {
          wait = "0";
      }
      return new MidiWriter.NoteEvent({pitch: arrNumMidi, duration: duration, wait: wait, velocity: 100});
  }

    /**
    * Builds a Track from a given chord.
    * @private
    * @param {string[]} arrChordNotes - chordNotes
    * @param {Object} instrData - instrument data for track
    * @return {Track} - a MidiWriter Track
    */
  _buildTrack(arrChordNotes, instrData) {
    var notes, midiNumber, midiNumbers;
    var returnTrack = new MidiWriter.Track();
    returnTrack.addEvent(new MidiWriter.ProgramChangeEvent({instrument : instrData.midiInstrumentCode}));
    returnTrack.addInstrumentName(instrData.name);

    for(var i = 0; i < arrChordNotes.length; i++) {
      midiNumbers = [];
      notes = arrChordNotes[i].split(" ");

      notes.forEach(function(note){
        midiNumbers.push(tonalNote.midi(note));
      })

      returnTrack.addEvent(this._buildMidi(midiNumbers, AcConstants.DEFAULT_NOTE_DURATION));
    }

    return returnTrack;
  }

    /**
    * Gets the MIDI data for a given melody.
    * @param {string[]} arrMelody - our melody
    * @return {string} - MIDI data, as a DataURI string
    */
  buildMelodyMidi(arrMelody) {
    var tracks = [], midiNumber;
    tracks[0] = this._buildTrack(arrMelody, INSTRUMENT_DATA["melody"]);

    var write = new MidiWriter.Writer(tracks);

    return write.dataUri();
  }

    /**
    * Gets the MIDI data for a given melody, with accompaniment.
    * @param {string[]} arrMelody - main melody
    * @param {string[]} arrAcompanimentLine - accompaniment line
    * @param {string[]} arrBassLine - bass line
    * @return {string} - MIDI data, as a DataURI string.
    */
  buildMelodyMidiWithAccompaniment(arrMelody, arrAcompanimentLine, arrBassLine) {
    var tracks, midiNumber;

    var melodyTrack = this._buildTrack(arrMelody, INSTRUMENT_DATA["melody"]);
    var accompanimentTrack = this._buildTrack(arrAcompanimentLine, INSTRUMENT_DATA["accompaniment"]);
    var bassTrack = this._buildTrack(arrBassLine, INSTRUMENT_DATA["bass"]);

    tracks = [melodyTrack, accompanimentTrack, bassTrack];

    var write = new MidiWriter.Writer(tracks);

    return write.dataUri();
  }
}

module.exports = new AutoComposerMidiWriter();
