// Plays MIDI files on the browser!

const MidiPlayer = require('midi-player-js');
const SoundfontPlayer = require('soundfont-player');
const tonalNote = require('tonal-note');

const AcMidiWriter = require('./autocomposer-midi-writer');
const AcConstants = require('./autocomposer-constants');
const INSTRUMENT_DATA = AcConstants.instrumentData;

/**
* Class responsible for playing audio on the browser.
* @emits {statusUpdate} - Emits this event when the audio player loads.
*/

class AutoComposerMidiPlayer {
  constructor() {
    this.instruments = {};
    this.numInstrumentsInit = 0;

    this.player = null;
    this.audioContext = new AudioContext();

    this.initialized = false;
    // Added this flag to fix an issue where notes randomly play again after the track ends.
    // It only works for tracks that are all the same length. If we ever have to play tracks that have
    // different lengths, we'll need a different solution.
    this.playbackLocked = true;

    // is this kind of scope hackery necessary?!
    var haxThis = this;
    var currentInstrument;

    for (var instrumentRole in INSTRUMENT_DATA) {
      // initialize each instrument
      if(typeof INSTRUMENT_DATA[instrumentRole] !== "function") {
        Soundfont.instrument(this.audioContext, INSTRUMENT_DATA[instrumentRole].name, {soundfont: 'FluidR3_GM'}).then(function (sfInstrument) {
          currentInstrument = INSTRUMENT_DATA.getByName(sfInstrument.name);

          haxThis.instruments[currentInstrument.role] = sfInstrument;

          haxThis.numInstrumentsInit++;

          if(haxThis.numInstrumentsInit === AcConstants.DEFAULT_NUM_INSTRUMENTS) {
            haxThis._finishLoad();
          }
        });
      }
    }

  }

    /**
    * Triggers the note playing for all instruments. Called for every MIDI event in the app.
    * @private
    * @param {number} event - MIDI event
    */
  _midiCallback(event) {
    // callback for MIDI events
    var instr1 = this.instruments["melody"];
    var instr2 = this.instruments["accompaniment"];
    var instr3 = this.instruments["bass"];

    if (!this.playbackLocked && event.name == 'Note on' && event.velocity > 0) {
        switch(event.track) {
          case 1:
            instr1.play(event.noteName, this.audioContext.currentTime, {gain: instr1.gain});
            break;
          case 2:
            instr2.play(event.noteName, this.audioContext.currentTime, {gain: instr2.gain});
            break;
          case 3:
            instr3.play(event.noteName, this.audioContext.currentTime, {gain: instr3.gain});
            break;
          default:
            // nothing!
        }
    }

    if (event.name == 'Note off') {
      switch(event.track) {
        case 1:
          instr1.stop();
          break;
        case 2:
          instr2.stop();
          break;
        case 3:
          instr3.stop();
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
    * Plays the given melody.
    * @param {string[]} melodySolo - solo melody (violin)
    */
  playMelodySolo(melodySolo) {
    var strMidi = AcMidiWriter.buildMelodyMidi(melodySolo);
    this._playMelody(strMidi);
  }
    /**
    * Plays the given melodies.
    * @param {string[]} melodySolo - solo melody (violin)
    * @param {string[]} melodyAccomp - accompaniment melody (piano)
    * @param {string[]} melodyBass - bass melody (bass)
    */
  playMelodyWithAccompaniment(melodySolo, melodyAccomp, melodyBass) {
    var strMidi = AcMidiWriter.buildMelodyMidiWithAccompaniment(melodySolo, melodyAccomp, melodyBass);
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
    this.instruments["melody"].stop();
    this.instruments["accompaniment"].stop();
    this.instruments["bass"].stop();
    this.player.stop();
  }
}

module.exports = new AutoComposerMidiPlayer();
