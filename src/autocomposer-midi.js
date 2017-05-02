var MidiWriter = require('midi-writer-js');
var MidiPlayer = require('midi-player-js');
var SoundfontPlayer = require('soundfont-player');
var tonalNote = require('tonal-note');

/**
* Class responsible for playing audio and generating MIDI files for users.
* @emits {statusUpdate} - Emits this event when the audio player successfully loads.
*/
class AutoComposerMidi {
  constructor() {
    this.NOTE_DURATION = "1";
    this.NUM_INSTRUMENTS = 3;

    this.instrumentData = {
      melody: {
        name: "violin",
        sfInstrument: null, // actual instrument to be used by the app
        gain: 1.7,
        midiInstrumentCode: 40
      },
      accompaniment: {
        name: "acoustic_guitar_steel",
        sfInstrument: null,
        gain: 1.6,
        midiInstrumentCode: 25
      },
      bass: {
        name: "acoustic_bass",
        sfInstrument: null,
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
    };

    this.numInstrumentsInit = 0;

    this.player = null;
    this.audioContext = new AudioContext;

    this.initialized = false;
    // Added this flag to fix an issue where notes randomly play again after the track ends.
    // It only works for tracks that are all the same length. If we ever have to play tracks that have
    // different lengths, we'll need a different solution.
    this.playbackLocked = true;

    // is this kind of scope hackery necessary?!
    var haxThis = this;
    var currentInstrument;

    for (var instrumentRole in this.instrumentData) {
      // initialize each instrument
      if(typeof this.instrumentData[instrumentRole] !== "function")
      Soundfont.instrument(this.audioContext, haxThis.instrumentData[instrumentRole].name, {soundfont: 'FluidR3_GM'}).then(function (sfInstrument) {
        currentInstrument = haxThis.instrumentData.getByName(sfInstrument.name);
        currentInstrument.sfInstrument = sfInstrument;

        haxThis.numInstrumentsInit++;

        console.log("[INNER FUNCTION] instrumentRole=" + instrumentRole);
        console.log(currentInstrument);
        console.log(sfInstrument);
        if(haxThis.numInstrumentsInit === haxThis.NUM_INSTRUMENTS) {
          haxThis._finishLoad();
        }
      });
    }

  }

    /**
    * Triggers the note playing for all instruments. Called for every MIDI event in the app.
    * @private
    * @param {number} event - MIDI event
    */
  _midiCallback(event) {
    // callback for MIDI events
    var instr1 = this.instrumentData["melody"];
    var instr2 = this.instrumentData["accompaniment"];
    var instr3 = this.instrumentData["bass"];

    if (!this.playbackLocked && event.name == 'Note on' && event.velocity > 0) {
        switch(event.track) {
          case 1:
            instr1.sfInstrument.play(event.noteName, this.audioContext.currentTime, {gain: instr1.gain});
            break;
          case 2:
            instr2.sfInstrument.play(event.noteName, this.audioContext.currentTime, {gain: instr2.gain});
            break;
          case 3:
            instr3.sfInstrument.play(event.noteName, this.audioContext.currentTime, {gain: instr3.gain});
            break;
          default:
            // nothing!
        }
    }

    if (event.name == 'Note off') {
      switch(event.track) {
        case 1:
          instr1.sfInstrument.stop();
          break;
        case 2:
          instr2.sfInstrument.stop();
          break;
        case 3:
          instr3.sfInstrument.stop();
          break;
        default:
          // nothing!
      }
    }

    if (event.name == "End of Track") {
      this.playbackLocked = true;
    }
  }

    /**
    * Completes the loading of this class. The "midiPlayerReady" eve
    * @private
    * @emits {statusUpdate} - Emits this event when the audio player successfully loads
    */
  _finishLoad() {
    var haxThis = this;
    this.player = new MidiPlayer.Player(function(event) {
      haxThis._midiCallback(event);
    });
    this.initialized = true;
    this.playbackLocked = false;

    var updateEvent = new CustomEvent('statusUpdate', {detail: "MIDI player is loaded!"});
    document.body.dispatchEvent(updateEvent);
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
    * @param {Object} instrumentData - instrument data for track
    * @return {Track} - a MidiWriter Track
    */
  _buildTrack(arrChordNotes, instrumentData) {
    var notes, midiNumber, midiNumbers;
    var returnTrack = new MidiWriter.Track();
    returnTrack.addEvent(new MidiWriter.ProgramChangeEvent({instrument : instrumentData.midiInstrumentCode}));
    returnTrack.addInstrumentName(instrumentData.name);

    for(var i = 0; i < arrChordNotes.length; i++) {
      midiNumbers = [];
      notes = arrChordNotes[i].split(" ");

      notes.forEach(function(note){
        midiNumbers.push(tonalNote.midi(note));
      })

      returnTrack.addEvent(this._buildMidi(midiNumbers, this.NOTE_DURATION));
    }

    return returnTrack;
  }

    /**
    * Gets the MIDI data for a given melody.
    * @private
    * @param {string[]} arrMelody - our melody
    * @return {string} - MIDI data, as a DataURI string
    */
  _buildMelodyMidiSolo(arrMelody) {
    var tracks = [], midiNumber;
    tracks[0] = this._buildTrack(arrMelody, this.instrumentData["melody"]);

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

    var melodyTrack = this._buildTrack(arrMelody, this.instrumentData["melody"]);
    var accompanimentTrack = this._buildTrack(arrAcompanimentLine, this.instrumentData["accompaniment"]);
    var bassTrack = this._buildTrack(arrBassLine, this.instrumentData["bass"]);

    tracks = [melodyTrack, accompanimentTrack, bassTrack];

    var write = new MidiWriter.Writer(tracks);

    return write.dataUri();
  }

    /**
    * Plays the given melody.
    * @param {string[]} melodySolo - solo melody (violin)
    */
  playMelodySolo(melodySolo) {
    var strMidi = this._buildMelodyMidiSolo(melodySolo);
    this._playMelody(strMidi);
  }
    /**
    * Plays the given melodies.
    * @param {string[]} melodySolo - solo melody (violin)
    * @param {string[]} melodyAccomp - accompaniment melody (piano)
    * @param {string[]} melodyBass - bass melody (bass)
    */
  playMelodyWithAccompaniment(melodySolo, melodyAccomp, melodyBass) {
    var strMidi = this.buildMelodyMidiWithAccompaniment(melodySolo, melodyAccomp, melodyBass);
    this._playMelody(strMidi);
  }

    /**
    * Actually plays the given melody
    * @private
    * @param {string} strMidi - MIDI data, as a DataURI string.
    */
  _playMelody(strMidi) {
    if(this.initialized) {
      this.stopPlayback();
      this.playbackLocked = false;
      this.player.loadDataUri(strMidi);
      this.player.play();
    } else {
      console.warn("[AutoComposerMidi._playMelody()] Player isn't initialized yet...");
    }
  }

    /**
    * Stops all playback
    */
  stopPlayback() {
    this.instrumentData["melody"].sfInstrument.stop();
    this.instrumentData["accompaniment"].sfInstrument.stop();
    this.instrumentData["bass"].sfInstrument.stop();
    this.player.stop();
  }
}

exports.AutoComposerMidi = AutoComposerMidi;
